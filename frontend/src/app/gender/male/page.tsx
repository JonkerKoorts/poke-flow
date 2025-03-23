import { getAvailableTypes } from "@/lib/services/api.service";
import MalePageContent from "./male-page-content";

const MalePage = async () => {
  const initialTypes = await getAvailableTypes("male");

  return <MalePageContent initialTypes={initialTypes || []} />;
};

export default MalePage;
