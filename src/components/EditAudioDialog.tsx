import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAudioUpdate from "@/hooks/useAudioUpdate";
import { useState } from "react";
import { Edit } from "lucide-react";

export interface EditableAudioData {
  id: number;
  title: string;
  bpm: number;
  genre: string;
}

export interface EditAudioDialogProps {
  initialData: EditableAudioData;
}

export default function EditAudioDialog({ initialData }: EditAudioDialogProps) {
  const [formData, setFormData] = useState<EditableAudioData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { updateFile, error } = useAudioUpdate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "bpm" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateFile(formData);

      setIsOpen(false); // Close dialog on success
    } catch (error) {
      console.error("Failed to update audio file:", error);
      // TODO: Add user-facing error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between w-full">
          <Button variant="link" className=" font-medium ">
            Edit
          </Button>
          <Edit />
        </div>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Audio Track</DialogTitle>

            <DialogDescription>
              Update the metadata for the file {initialData.title}.
              {error?.message}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Displaying ID (not editable) */}§{/* Title Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {/* BPM Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bpm" className="text-right">
                BPM
              </Label>
              <Input
                id="bpm"
                name="bpm"
                type="number"
                value={formData.bpm === 0 ? "" : formData.bpm} // Display empty string for 0 to prompt input
                onChange={handleChange}
                className="col-span-3"
                min="0"
                required
              />
            </div>
            {/* Genre Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">
                Genre
              </Label>
              <Input
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
