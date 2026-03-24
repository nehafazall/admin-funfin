"use client";
import { AlertModal } from "@/components/global/modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Info, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Children, useEffect, useState } from "react";
import { SheetReuse } from "../sheet";
import { Modal } from "@/components/ui/modal";

interface props {
  id: string;
  updateForm?: React.ReactNode;
  deletFn?: Function;
  info?: React.ReactNode;
  dltLoading?: boolean;
  isSuccess?: boolean;
  updateFn?: Function;
}

export const CellAction = ({
  id,
  updateForm,
  deletFn,
  info,
  dltLoading,
  isSuccess,
  updateFn,
}: props) => {
  const [loading, setLoading] = useState(dltLoading || false);
  const [open, setOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const sheetState=!!updateForm||!!updateFn
  const closeSheet = () => setShowEdit(false);
  const openSheet = () => setShowEdit(true);
  const showInfoFN = () => setShowInfo(true);
  const closeInfoFN = () => setShowInfo(false);
  useEffect(() => {
    if (isSuccess) setOpen(false);
  }, [isSuccess]);
  
  return (
    <>
      {deletFn && (
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={() => deletFn && deletFn()}
          loading={loading ||dltLoading}
        />
      )}
      {updateForm && (
        <SheetReuse
          title="Edit "
          description="this action it will remark the date also"
          open={showEdit}
          closeFn={closeSheet}
        >
          {updateForm}
        </SheetReuse>
      )}

      {info && (
        <Modal
          isOpen={showInfo}
          onClose={closeInfoFN}
          title="info"
          description="information of order details..."
        >
          {info}
        </Modal>
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {info && (
            <DropdownMenuItem onClick={() => showInfoFN()}>
              <Info className="mr-2 h-4 w-4" /> Info
            </DropdownMenuItem>
          )}
          {sheetState && (
            <DropdownMenuItem
              onClick={() => {
                openSheet();
              updateFn && updateFn();
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
          )}
          {deletFn && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
