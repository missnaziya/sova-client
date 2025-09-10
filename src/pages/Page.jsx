import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet"; 
import { pageApi } from "../apis/authApis/pageApi";
import "./css/Page.css";

const Page = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);

  console.log(pageData , "pageData")

  useEffect(() => {
  const fetchPageData = async () => {
    const res = await pageApi();
        console.log("Live API Response:", res); 
    if (res && res.data?.pages) {
      const activePages = res?.data?.pages.filter(p => p.status === "active");
      const matchedPage = activePages.find(p => p.slug === slug);
      setPageData(matchedPage || null)
    }
  };

  fetchPageData();
}, [slug]);

  if (!pageData) return <h2 style={{ padding: "50px" }}>Page Not Found</h2>;

  return (
<>
      <section className="dynamic-banner" >
      <h2>{pageData?.name}</h2>
    </section>
    <div className="container">
      <Helmet>
        <title>{pageData.metaTitle || "Page"}</title>
        <meta name="description" content={pageData.metaDescription || ""} />
      </Helmet>
   <h3>{pageData?.name}</h3>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
</>
  );
};

export default Page;
