import { Tabs } from "@chakra-ui/react";

interface TabsEngineProps {
  onEngineChange: (engine: string) => void;
}

export const TabsEngine: React.FC<TabsEngineProps> = ({ onEngineChange }) => {
  const engines = ["MergeTree", "ReplacingMergeTree", "AggregatingMergeTree"];

  return (
    <Tabs.Root
      onChange={(index) => onEngineChange(engines[index])}
      defaultValue="MergeTree"
      w={'100%'}
    >
      <Tabs.List>
        <Tabs.Trigger value="MergeTree">MergeTree</Tabs.Trigger>
        <Tabs.Trigger value="ReplacingMergeTree">ReplacingMergeTree</Tabs.Trigger>
        <Tabs.Trigger value="AggregatingMergeTree">AggregatingMergeTree</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="MergeTree">
        MergeTree — это основной движок таблиц в ClickHouse. Он обеспечивает высокую производительность для аналитических запросов.
      </Tabs.Content>
      <Tabs.Content value="ReplacingMergeTree">
        ReplacingMergeTree — это движок, который автоматически удаляет дубликаты данных на основе первичного ключа.
      </Tabs.Content>
      <Tabs.Content value="AggregatingMergeTree">
        AggregatingMergeTree — это движок, который автоматически агрегирует данные при вставке.
      </Tabs.Content>
    </Tabs.Root>
  );
};