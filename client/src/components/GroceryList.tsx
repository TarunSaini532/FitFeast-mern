import { useGroceryList } from "@/hooks/use-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useState } from "react";

export function GroceryList() {
  const { data: list, isLoading } = useGroceryList();
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Proteins");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!list) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-secondary" />
          Grocery List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(list.categories).map(([category, items]) => (
          <div key={category}>
            <button
              onClick={() =>
                setExpandedCategory(expandedCategory === category ? null : category)
              }
              className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg transition"
            >
              <span className="font-semibold text-sm">{category}</span>
              <ChevronDown
                className={`w-4 h-4 transition ${
                  expandedCategory === category ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCategory === category && (
              <div className="mt-2 ml-4 space-y-1 pb-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
