import {
  Card,
  Title,
  Text,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Metric,
  AreaChart,
  BarChart,
  DonutChart,
  Grid,
} from "@tremor/react";
import {
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
// import { eventService } from "@/features/events/services/event.service";

export function DashboardHome() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   loadStats();
  // }, []);

  // const loadStats = async () => {
  //   try {
  //     const data = await eventService.getEventStats();
  //     setStats(data);
  //   } catch (error) {
  //     console.error('Failed to load stats:', error);
  //   } finally {
  //     setIsLoading(false);
  //  
  const categories = [
    {
      title: "Total Events",
      metric: stats.totalEvents.toString(),
      icon: CalendarIcon,
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      title: "Total Participants",
      metric: stats.totalParticipants.toString(),
      icon: UserGroupIcon,
      color: "black",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
    },
    {
      title: "Upcoming Events",
      metric: stats.upcomingEvents.toString(),
      icon: ChartBarIcon,
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-500",
    },
    {
      title: "Completed Events",
      metric: stats.completedEvents.toString(),
      icon: TrophyIcon,
      color: "black",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section avec effet de glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 p-10 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-orange-100 mt-3 text-lg">
            Welcome back, Here's your event analytics
          </p>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
              <span className="text-white/60 text-sm">Today's Date</span>
              <p className="text-white font-semibold">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      </div>

      {/* KPI Cards avec design amélioré */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {categories.map((item) => (
          <Card 
            key={item.title} 
            className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100/50 backdrop-blur-sm bg-white/80"
          >
            <div className="flex items-center justify-between p-6">
              <div>
                <Text className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                  {item.title}
                </Text>
                <Metric className="text-4xl font-bold mt-3 text-gray-900">
                  {item.metric}
                </Metric>
                <div className="flex items-center mt-4">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full" 
                      style={{ width: '70%' }}
                    ></div>
                  </div>
                  <span className="text-orange-500 text-sm font-semibold ml-3">+12.3%</span>
                </div>
              </div>
              <div className={`${item.bgColor} p-5 rounded-2xl shadow-lg`}>
                <item.icon className={`h-10 w-10 ${item.textColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </Grid>

      {/* Tabs avec design moderne */}
      <TabGroup>
        <TabList className="mt-8 bg-white/80 p-2 rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm">
          {["Events Overview", "Participants", "Locations"].map((tab) => (
            <Tab 
              key={tab}
              className="px-8 py-4 text-sm font-medium rounded-xl transition-all duration-300
                ui-selected:bg-gradient-to-r ui-selected:from-orange-500 ui-selected:to-orange-600 
                ui-selected:text-white ui-selected:shadow-lg
                ui-not-selected:text-gray-600 ui-not-selected:hover:bg-orange-50"
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <Grid numItems={1} numItemsLg={2} className="gap-6 mt-6">
              {/* Events by Month avec design moderne */}
              <Card className="p-8 transform hover:shadow-2xl transition-all duration-300 border border-gray-100/50 backdrop-blur-sm bg-white/80">
                <div className="flex flex-col mb-8">
                  <Title className="text-2xl font-bold text-gray-900">
                    Events by Month
                  </Title>
                  <Text className="text-gray-500 mt-2">
                    Monthly event distribution and trends
                  </Text>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-gray-600">Current Year</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-sm text-gray-600">Previous Year</span>
                    </div>
                  </div>
                </div>
                <AreaChart
                  className="h-80 mt-4"
                  data={[
                    { date: "Jan", Events: 12, "Last Year": 8 },
                    { date: "Feb", Events: 15, "Last Year": 10 },
                    { date: "Mar", Events: 18, "Last Year": 12 },
                    { date: "Apr", Events: 22, "Last Year": 15 },
                    { date: "May", Events: 25, "Last Year": 18 },
                    { date: "Jun", Events: 28, "Last Year": 20 },
                  ]}
                  index="date"
                  categories={["Events", "Last Year"]}
                  colors={["orange", "gray"]}
                  showAnimation={true}
                  showLegend={false}
                  showGridLines={false}
                  showYAxis={true}
                  curveType="natural"
                  valueFormatter={(number) => `${number} events`}
                />
              </Card>

            </Grid>
          </TabPanel>

     
        </TabPanels>
      </TabGroup>
    </div>
  );
} 