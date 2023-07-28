import { useState } from "react";
import Select, { type CreatableProps } from "react-select/creatable";
import { api } from "~/utils/api";

export const ProduceSelect = (props: CreatableProps<any, any, any>) => {
  const [produceList, setProduceList] = useState<
    Array<{
      label: string;
      value: string;
    }>
  >([]);

  const { isLoading } = api.produce.list.useQuery(undefined, {
    onSuccess: (produce) => {
      setProduceList(
        produce.map((p) => ({
          label: p.name,
          value: p.id,
        }))
      );
    },
  });

  return <Select options={produceList} isLoading={isLoading} {...props} />;
};
