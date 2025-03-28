import { Card } from "@mantine/core";
import { BarChart } from "@mantine/charts";

export default function SalesChart() {
  // Sample data
  const data = [
    { day: "Sat", Texas: 500, NewYork: 300 },
    { day: "Sun", Texas: 350, NewYork: 250 },
    { day: "Mon", Texas: 420, NewYork: 310 },
    { day: "Tue", Texas: 480, NewYork: 400 },
    { day: "Wed", Texas: 200, NewYork: 150 },
    { day: "Thu", Texas: 300, NewYork: 380 },
    { day: "Fri", Texas: 360, NewYork: 280 },
  ];

  return (
    <Card
      shadow="sm"
      radius={"25px"}
      className="flex  rounded-[25px] specialBorder"
    >
      <div className="flex w-full justify-end p-4 space-x-6">
        {/* Texas Legend */}
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-[#71BF7D] rounded-full"></span>
          <span className="text-gray-800 font-medium">Texas</span>
        </div>

        {/* New York Legend */}
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-[#000000] rounded-full"></span>
          <span className="text-gray-600 font-medium">New York</span>
        </div>
      </div>

      {/* .. */}
      <BarChart
        data={data}
        barProps={{ radius: 30 }}
        dataKey="day"
        className="h-[235px] "
        strokeDasharray="0 0"
        barChartProps={{ barCategoryGap: "10%" }}
        maxBarWidth={12}
        series={[
          { name: "NewYork", color: "#000000" }, // Black
          { name: "Texas", color: "#71BF7D" }, // Green
        ]}
      />
    </Card>
  );
}
