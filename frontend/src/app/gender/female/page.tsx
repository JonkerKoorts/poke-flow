import { getAvailableTypes } from "@/lib/services/api.service";
import FemalePageContent from "./female-page-content";

const FemalePage = async () => {
  const initialTypes = await getAvailableTypes("female");

  return <FemalePageContent initialTypes={initialTypes || []} />;
};

export default FemalePage;
