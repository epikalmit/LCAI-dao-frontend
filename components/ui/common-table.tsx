import * as React from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import CopyButton from "@/components/CopyButton";

export type CommonTableItem = {
  label: string;
  value: React.ReactNode;
  copyValue?: string;
};

export type CommonTableSection = {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  items: CommonTableItem[];
  defaultCollapsed?: boolean;
};

type CommonTableProps = React.ComponentProps<"div"> & {
  sections: CommonTableSection[];
  columns?: 2 | 3 | 4;
};

function chunkItems(items: CommonTableItem[], size: number): CommonTableItem[][] {
  const chunks: CommonTableItem[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function CollapsibleSection({
  section,
  columns,
}: {
  section: CommonTableSection;
  columns: number;
}) {
  const [collapsed, setCollapsed] = React.useState(section.defaultCollapsed ?? false);
  const rows = chunkItems(section.items, columns);

  return (
    <section
      key={section.id ?? section.title}
      className="overflow-hidden rounded-2xl border border-border-default"
    >
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-[#a7a7a70f] dark:bg-surface-base-extralight">
            <th
              colSpan={columns}
              className={clsx(
                "px-4 lg:px-6 py-3 lg:py-5 text-left",
                !collapsed && "border-b border-border-default"
              )}
            >
              <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                className="flex items-center justify-between w-full gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {section.icon ? (
                    <span className="text-content-secondary">{section.icon}</span>
                  ) : null}
                  <h3 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-[-0.24px] text-content-primary">
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  className={clsx(
                    "size-5 text-content-secondary shrink-0 transition-transform duration-200",
                    collapsed && "-rotate-90"
                  )}
                />
              </button>
            </th>
          </tr>
        </thead>
      </table>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: collapsed ? "0fr" : "1fr" }}
      >
        <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse">
            <colgroup>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <col key={`${section.id ?? section.title}-col-${colIndex}`} />
              ))}
            </colgroup>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${section.id ?? section.title}-row-${rowIndex}`}>
                  {Array.from({ length: columns }).map((_, colIndex) => {
                    const item = row[colIndex];
                    const isLastRow = rowIndex === rows.length - 1;
                    const isLastCol = colIndex === columns - 1;

                    return (
                      <td
                        key={`${section.id ?? section.title}-${rowIndex}-${colIndex}`}
                        className={clsx(
                          "align-top min-h-24 p-4 lg:p-6",
                          !isLastRow && "border-b border-border-default",
                          !isLastCol && "border-r border-border-default"
                        )}
                      >
                        {item ? (
                          <>
                            <p className="text-content-medium text-sm leading-[1.42]">
                              {item.label}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 lg:mt-4">
                              <p className="text-content-primary text-[15px] lg:text-base font-medium lg:font-bold leading-none">
                                {item.value}
                              </p>
                              {item.copyValue ? (
                                <CopyButton text={item.copyValue} className="shrink-0" />
                              ) : null}
                            </div>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </section>
  );
}

export function CommonTable({
  sections,
  columns = 4,
  className,
  ...props
}: CommonTableProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {sections.map((section) => (
        <CollapsibleSection
          key={section.id ?? section.title}
          section={section}
          columns={columns}
        />
      ))}
    </div>
  );
}
