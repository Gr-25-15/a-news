import { getCompanyStock } from "./actions/getStock";
import { ComponentExample } from "@/components/component-example";
import { Card } from "@/components/ui/card";

import AiComponent from "@/components/ai-component";
import CreateArticle from "@/components/create-article-form";
import { getCateoryFormData } from "./actions/getCategories";

export default async function Page() {
  const categories = await getCateoryFormData();
  const data = await getCompanyStock("AAPL");

  return (
    <>
      <ComponentExample />
      <Card className="p-4 mb-4 w-md m-auto">
        <h2 className="text-lg font-semibold mb-2">Market Data Fetcher</h2>
        <p>Click the button below to fetch stock data for Apple Inc. (AAPL).</p>
        <div>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
      </Card>

      <Card className="p-4 mb-4 w-md m-auto">
        <AiComponent />
      </Card>
      <CreateArticle categories={categories} />
    </>
  );
}
