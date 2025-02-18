import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import type { NewsItem } from "@shared/schema";

export default function News() {
  const { data: newsItems, isLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Trending News
          </h1>
        </div>
        <div className="space-y-4">
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="hover:bg-muted/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : newsItems?.length ? (
              newsItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.author && <span>{item.author}</span>}
                      {item.publishedAt && (
                        <span className="ml-2">
                          {formatDistanceToNow(new Date(item.publishedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {item.urlToImage && (
                      <img
                        src={item.urlToImage}
                        alt={item.title}
                        className="h-24 w-full rounded-md object-cover"
                      />
                    )}
                    <div className="space-y-2 text-sm mt-2">
                      <p>{item.description}</p>
                      {item.content && (
                        <p className="text-muted-foreground">
                          {item.content.slice(0, 100)}...
                        </p>
                      )}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline"
                      >
                        Read more
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">
                No news yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
