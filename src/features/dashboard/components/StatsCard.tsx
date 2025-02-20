import { Card, Metric, Text, Flex, ProgressBar } from "@tremor/react";

interface StatsCardProps {
  title: string;
  metric: string;
  progress: number;
  target: string;
}

export function StatsCard({ title, metric, progress, target }: StatsCardProps) {
  return (
    <Card>
      <Text>{title}</Text>
      <Metric>{metric}</Metric>
      <Flex className="mt-4">
        <Text>{`${progress}% of ${target}`}</Text>
        <Text>{target}</Text>
      </Flex>
      <ProgressBar value={progress} className="mt-2" />
    </Card>
  );
} 