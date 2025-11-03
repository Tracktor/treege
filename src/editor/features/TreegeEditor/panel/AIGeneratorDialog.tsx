import { Edge, Node } from "@xyflow/react";
import { Loader2, WandSparkles } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { toast } from "sonner";
import { AIConfig } from "@/editor/types/ai";
import { generateTreeWithAI } from "@/editor/utils/aiTreeGenerator";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";

export interface AIGeneratorDialogProps {
  /**
   * AI configuration from context
   */
  aiConfig?: AIConfig;
  /**
   * Callback when tree is generated
   */
  onGenerate: (data: { edges: Edge[]; nodes: Node[] }) => void;
}

export const AIGeneratorDialog = ({ aiConfig, onGenerate }: AIGeneratorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!aiConfig?.apiKey) {
      toast.error("AI configuration missing", {
        description: "Please configure your AI API key in TreegeEditorProvider",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await generateTreeWithAI({
        config: aiConfig,
        prompt: prompt.trim(),
      });

      onGenerate({
        edges: result.edges,
        nodes: result.nodes,
      });

      toast.success("Tree generated successfully!", {
        description: `Created ${result.nodes.length} nodes and ${result.edges.length} edges`,
      });

      // Reset and close
      setPrompt("");
      setOpen(false);
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate tree", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void handleGenerate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!aiConfig?.apiKey}>
          <WandSparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Generate Flow with AI</DialogTitle>
          <DialogDescription>Describe the form or decision tree you want to create, and AI will generate it for you.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="ai-prompt" className="font-medium text-sm">
              Description
            </label>
            <Textarea
              placeholder="Example: Create a contact form with name, email, phone number, and message fields"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={6}
              disabled={loading}
              className="resize-none"
            />
            <p className="text-muted-foreground text-xs">
              Press <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-xs">⌘ Enter</kbd> or{" "}
              <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Ctrl Enter</kbd> to generate
            </p>
          </div>

          {!aiConfig?.apiKey && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">AI not configured</p>
              <p className="mt-1 text-muted-foreground text-xs">
                Add <code className="rounded bg-background px-1 py-0.5">aiConfig</code> prop to TreegeEditorProvider
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim() || !aiConfig?.apiKey}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <WandSparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
