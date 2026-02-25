import { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useVaultStore from "../stores/vaultStore";

const VaultSession = () => {
  const selectedContent = useVaultStore((s) => s.selectedContent);
  const selectedSessionId = useVaultStore((s) => s.selectedSessionId);
  const sessions = useVaultStore((s) => s.sessions);

  const session = useMemo(
    () => sessions.find((s) => s.id === selectedSessionId),
    [sessions, selectedSessionId],
  );

  const parsedContent = useMemo(() => {
    if (!selectedContent) return undefined;
    try {
      return JSON.parse(selectedContent);
    } catch {
      return undefined;
    }
  }, [selectedContent]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          codeBlock: false,
          horizontalRule: false,
          dropcursor: false,
          gapcursor: false,
        }),
      ],
      content: parsedContent,
      editable: false,
      editorProps: {
        attributes: {
          class: "tiptap",
        },
      },
    },
    [parsedContent],
  );

  if (!session || !editor) return null;

  return (
    <div
      className="vault-session"
      style={{ backgroundColor: session.average_vibe }}
    >
      <EditorContent editor={editor} />
      <span className="vault-back-hint">esc</span>
    </div>
  );
};

export default VaultSession;
