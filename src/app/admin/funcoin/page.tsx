"use client";

import {
  createFuncoinCategory,
  createFuncoinTransaction,
  getFuncoinCategories,
  getFuncoinPrice,
  getFuncoinPurchases,
  getFuncoinTransactions,
  updateFuncoinCategory,
  updateFuncoinPrice,
} from "@/api/funcoin";
import PageContainer from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FuncoinAdminPurchase,
  FuncoinCategory,
  FuncoinKind,
  FuncoinPricing,
  FuncoinTransaction,
} from "@/types/IFuncoin";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const defaultPricing: FuncoinPricing = {
  baseCurrency: "INR",
  pricePerCoin: 1,
};

export default function FuncoinPage() {
  const { data: session } = useSession();
  const token = session?.user?.token as string | undefined;

  const [loading, setLoading] = useState(true);
  const [savingPrice, setSavingPrice] = useState(false);
  const [pricing, setPricing] = useState<FuncoinPricing>(defaultPricing);
  const [priceInput, setPriceInput] = useState("1");

  const [categories, setCategories] = useState<FuncoinCategory[]>([]);
  const [newCategory, setNewCategory] = useState({
    code: "",
    name: "",
    kind: "earn" as FuncoinKind,
    description: "",
    sortOrder: "0",
  });
  const [categoryBusyCode, setCategoryBusyCode] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<FuncoinTransaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    userId: "",
    kind: "earn" as FuncoinKind,
    categoryCode: "",
    coins: "",
    notes: "",
  });
  const [creatingTransaction, setCreatingTransaction] = useState(false);

  const [purchases, setPurchases] = useState<FuncoinAdminPurchase[]>([]);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<"all" | "created" | "paid" | "failed">("all");
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.kind === newTransaction.kind && category.isActive),
    [categories, newTransaction.kind]
  );

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    try {
      const [priceRes, categoryRes, txRes, purchaseRes] = await Promise.all([
        getFuncoinPrice(token),
        getFuncoinCategories(token),
        getFuncoinTransactions(token, { skip: 0, limit: 10 }),
        getFuncoinPurchases(token, { skip: 0, limit: 10 }),
      ]);

      setPricing(priceRes);
      setPriceInput(String(priceRes.pricePerCoin));
      setCategories(categoryRes.categories || []);
      setTransactions(txRes.transactions || []);
      setPurchases(purchaseRes.purchases || []);
    } catch (error) {
      toast.error((error as Error).message || "Failed to load funcoin data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadPurchases = async () => {
    if (!token) return;
    setLoadingPurchases(true);

    try {
      const response = await getFuncoinPurchases(token, {
        username: usernameFilter || undefined,
        status: purchaseStatusFilter === "all" ? undefined : purchaseStatusFilter,
        skip: 0,
        limit: 25,
      });
      setPurchases(response.purchases || []);
    } catch (error) {
      toast.error((error as Error).message || "Failed to filter purchases");
    } finally {
      setLoadingPurchases(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onUpdatePrice = async () => {
    if (!token) return;
    const nextPrice = Number(priceInput);
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
      toast.error("Price per coin must be a positive number");
      return;
    }

    setSavingPrice(true);
    try {
      const response = await updateFuncoinPrice({ pricePerCoin: nextPrice }, token);
      setPricing(response);
      setPriceInput(String(response.pricePerCoin));
      toast.success("Funcoin price updated");
    } catch (error) {
      toast.error((error as Error).message || "Failed to update price");
    } finally {
      setSavingPrice(false);
    }
  };

  const onCreateCategory = async () => {
    if (!token) return;

    if (!newCategory.code.trim() || !newCategory.name.trim()) {
      toast.error("Code and name are required");
      return;
    }

    try {
      setCategoryBusyCode("__new__");
      const created = await createFuncoinCategory(
        {
          code: newCategory.code.trim(),
          name: newCategory.name.trim(),
          kind: newCategory.kind,
          description: newCategory.description.trim() || undefined,
          sortOrder: Number(newCategory.sortOrder) || 0,
          isActive: true,
        },
        token
      );

      setCategories((prev) => [created, ...prev]);
      setNewCategory({ code: "", name: "", kind: "earn", description: "", sortOrder: "0" });
      toast.success("Category created");
    } catch (error) {
      toast.error((error as Error).message || "Failed to create category");
    } finally {
      setCategoryBusyCode(null);
    }
  };

  const onToggleCategoryActive = async (category: FuncoinCategory) => {
    if (!token) return;

    try {
      setCategoryBusyCode(category.code);
      const updated = await updateFuncoinCategory(
        category.code,
        { isActive: !category.isActive },
        token
      );

      setCategories((prev) =>
        prev.map((item) => (item.code === category.code ? updated : item))
      );
    } catch (error) {
      toast.error((error as Error).message || "Failed to update category");
    } finally {
      setCategoryBusyCode(null);
    }
  };

  const onCreateTransaction = async () => {
    if (!token) return;

    if (!newTransaction.userId.trim() || !newTransaction.categoryCode || !newTransaction.coins) {
      toast.error("User ID, category and coins are required");
      return;
    }

    const coins = Number(newTransaction.coins);
    if (!Number.isFinite(coins) || coins <= 0) {
      toast.error("Coins must be a positive number");
      return;
    }

    try {
      setCreatingTransaction(true);
      const created = await createFuncoinTransaction(
        {
          userId: newTransaction.userId.trim(),
          kind: newTransaction.kind,
          categoryCode: newTransaction.categoryCode,
          coins,
          notes: newTransaction.notes.trim() || undefined,
        },
        token
      );

      setTransactions((prev) => [created, ...prev].slice(0, 25));
      setNewTransaction({
        userId: "",
        kind: "earn",
        categoryCode: "",
        coins: "",
        notes: "",
      });
      toast.success("Transaction recorded");
    } catch (error) {
      toast.error((error as Error).message || "Failed to create transaction");
    } finally {
      setCreatingTransaction(false);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 w-full">
        <Heading
          title="Funcoin"
          description="Manage pricing, categories, wallet transactions, and purchase history"
        />
        <Separator />

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="pricing" className="w-full">
            <TabsList>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Price Per Coin</CardTitle>
                  <CardDescription>
                    Base currency is {pricing.baseCurrency}. Update the live conversion used by Funcoin purchase APIs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="pricePerCoin">Price (INR)</Label>
                      <Input
                        id="pricePerCoin"
                        type="number"
                        min="0"
                        step="0.01"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Current Value</Label>
                      <p className="h-9 flex items-center rounded-md border px-3 text-sm font-medium">
                        {pricing.pricePerCoin}
                      </p>
                    </div>

                    <Button onClick={onUpdatePrice} disabled={savingPrice}>
                      {savingPrice ? "Saving..." : "Update Price"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Category</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <Input
                    placeholder="Code (e.g. daily_spin)"
                    value={newCategory.code}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, code: e.target.value }))}
                  />
                  <Input
                    placeholder="Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <Select
                    value={newCategory.kind}
                    onValueChange={(value: FuncoinKind) =>
                      setNewCategory((prev) => ({ ...prev, kind: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kind" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earn">Earn</SelectItem>
                      <SelectItem value="spend">Spend</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Sort Order"
                    type="number"
                    value={newCategory.sortOrder}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, sortOrder: e.target.value }))}
                  />
                  <Button onClick={onCreateCategory} disabled={categoryBusyCode === "__new__"}>
                    {categoryBusyCode === "__new__" ? "Creating..." : "Create"}
                  </Button>
                  <div className="md:col-span-2 lg:col-span-5">
                    <Textarea
                      placeholder="Description (optional)"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Kind</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sort</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.code}</TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {category.kind}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                              {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{category.sortOrder}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={categoryBusyCode === category.code}
                              onClick={() => onToggleCategoryActive(category)}
                            >
                              {categoryBusyCode === category.code
                                ? "Saving..."
                                : category.isActive
                                  ? "Disable"
                                  : "Enable"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {categories.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No categories found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Record Wallet Transaction</CardTitle>
                  <CardDescription>
                    Manual adjustment by user ID and category.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Input
                      placeholder="User ID"
                      value={newTransaction.userId}
                      onChange={(e) =>
                        setNewTransaction((prev) => ({ ...prev, userId: e.target.value }))
                      }
                    />

                    <Select
                      value={newTransaction.kind}
                      onValueChange={(value: FuncoinKind) => {
                        setNewTransaction((prev) => ({
                          ...prev,
                          kind: value,
                          categoryCode: "",
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Transaction kind" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="earn">Earn</SelectItem>
                        <SelectItem value="spend">Spend</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={newTransaction.categoryCode}
                      onValueChange={(value) =>
                        setNewTransaction((prev) => ({ ...prev, categoryCode: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem value={category.code} key={category.id}>
                            {category.name} ({category.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min="1"
                      placeholder="Coins"
                      value={newTransaction.coins}
                      onChange={(e) =>
                        setNewTransaction((prev) => ({ ...prev, coins: e.target.value }))
                      }
                    />
                  </div>

                  <Textarea
                    placeholder="Notes (optional)"
                    value={newTransaction.notes}
                    onChange={(e) =>
                      setNewTransaction((prev) => ({ ...prev, notes: e.target.value }))
                    }
                  />

                  <Button onClick={onCreateTransaction} disabled={creatingTransaction}>
                    {creatingTransaction ? "Creating..." : "Record Transaction"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Kind</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>Balance After</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.userId}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {transaction.kind}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.categoryName}</TableCell>
                          <TableCell>{transaction.coins}</TableCell>
                          <TableCell>{transaction.balanceAfter}</TableCell>
                          <TableCell>
                            {new Date(transaction.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}

                      {transactions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Filters</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Username or email"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                  />

                  <Select
                    value={purchaseStatusFilter}
                    onValueChange={(value: "all" | "created" | "paid" | "failed") =>
                      setPurchaseStatusFilter(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={loadPurchases} disabled={loadingPurchases}>
                    {loadingPurchases ? "Loading..." : "Apply Filter"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>Amount (INR)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">{purchase.userName || purchase.userId}</TableCell>
                          <TableCell>{purchase.userEmail || "-"}</TableCell>
                          <TableCell>{purchase.coins}</TableCell>
                          <TableCell>{purchase.amountInr}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {purchase.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(purchase.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}

                      {purchases.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No purchases found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageContainer>
  );
}
