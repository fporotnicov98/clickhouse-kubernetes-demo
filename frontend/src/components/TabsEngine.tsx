import { Tabs } from "@chakra-ui/react";

interface TabsEngineProps {
  onEngineChange: (engine: string) => void;
}

export const TabsEngine: React.FC<TabsEngineProps> = ({ onEngineChange }) => {
  const engines = ["MergeTree", "ReplacingMergeTree", "AggregatingMergeTree"];

  return (
    <Tabs.Root
      onChange={(event) => {
        const target = event.target as HTMLDivElement;
        const value = target.getAttribute("data-value");

        if (value && engines.includes(value)) {
          onEngineChange(value);
        }
      }}
      defaultValue="MergeTree"
      w={'100%'}
    >
      <Tabs.List>
        {engines.map((engine) => (
          <Tabs.Trigger key={engine} value={engine}>
            {engine}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {engines.map((engine) => (
        <Tabs.Content key={engine} value={engine}>
          {engine === "MergeTree" && "MergeTree — это основной движок таблиц в ClickHouse. Он обеспечивает высокую производительность для аналитических запросов."}
          {engine === "ReplacingMergeTree" && "ReplacingMergeTree — это движок, который автоматически удаляет дубликаты данных на основе первичного ключа."}
          {engine === "AggregatingMergeTree" && "AggregatingMergeTree — это движок, который автоматически агрегирует данные при вставке."}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};
