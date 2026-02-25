import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const BLOCK_TYPES = [
  "paragraph",
  "heading",
  "blockquote",
  "bulletList",
  "orderedList",
];

export const TransientBlock = Extension.create({
  name: "transientBlock",

  addGlobalAttributes() {
    return [
      {
        types: BLOCK_TYPES,
        attributes: {
          blockId: {
            default: null,
            parseHTML: (element: HTMLElement) =>
              element.getAttribute("data-block-id"),
            renderHTML: (attributes: Record<string, unknown>) => {
              if (!attributes.blockId) return {};
              return { "data-block-id": attributes.blockId };
            },
          },
          fadeState: {
            default: "active",
            parseHTML: (element: HTMLElement) =>
              element.getAttribute("data-fade-state") || "active",
            renderHTML: (attributes: Record<string, unknown>) => {
              if (!attributes.fadeState || attributes.fadeState === "active")
                return {};
              return { "data-fade-state": attributes.fadeState };
            },
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("transientBlockIds"),
        appendTransaction: (_transactions, _oldState, newState) => {
          let tr = newState.tr;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (
              BLOCK_TYPES.includes(node.type.name) &&
              !node.attrs.blockId
            ) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                blockId: crypto.randomUUID(),
              });
              modified = true;
            }
          });

          return modified ? tr : null;
        },
      }),
    ];
  },
});
