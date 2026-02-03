import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ResetDialog({ open, onOpenChange, onConfirm }: ResetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[355px] rounded-[20px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="title3 mb-2 text-center">매칭 초기화</DialogTitle>
          <DialogDescription className="subhead3 text-custom-deepgray text-center">
            현재까지의 추천을 초기화하고
            <br />
            새로운 동료를 찾아보시겠어요?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-2 sm:justify-center">
          <Button
            onClick={onConfirm}
            className="bg-custom-red hover:bg-custom-red subhead1 h-12 w-1/2 rounded-xl text-white disabled:cursor-not-allowed"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
