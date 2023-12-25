import { Card, Metric, Text, Title,Flex, DonutChart, LineChart, Color, List, ListItem, Tracker } from "@tremor/react";
import { Badge, BadgeDelta } from "@tremor/react";
import header from './header.tsx';
import footer from './footer.tsx';

import './App.css'
import factorydata from '../../hyperledger-fabric/fabric-samples/asset-transfer-basic/application-javascript/data.json';

const last100Elements = factorydata.slice(-100);
const chartData = last100Elements.map(({ sid,Weight,Power, Pressure,Volume }) => {
  return {
    sid: parseInt(sid),
    Load:parseInt(Weight) ,
    Power: parseInt(Power),
    Pressure: parseInt(Pressure),
    Flow: parseInt(Volume)
  }
})

// Initialize sums
let sumLoad = 0;
let sumPower = 0;
let sumPressure = 0;
let sumFlow = 0;
let cnt=0;
let avg_load_consumption: number,avg_power_consumption: number,avg_flow_consumption: number,avg_pressure_consumption: number;

const needs_maintainance: { sid: number; reason: string; }[]=[];

const data: {key:number; color: string; tooltip: string;}[] = [];
let cnt_downtime=0;
let cnt_down_power=0,cnt_down_load=0,cnt_down_flow=0,cnt_down_pressure=0;

// Loop through the data and accumulate sums
factorydata.forEach(obj => {
  cnt+=1;
  if(parseInt(obj.Power)> 105){
    const myobj={sid: obj.sid,reason: "Power"};
    needs_maintainance.push(myobj);
    const dataobj={ key: obj.sid,color: "rose", tooltip: "Downtime" };
    data.push(dataobj);
    cnt_downtime+=1;
    cnt_down_power+=1;
  }

  if(parseInt(obj.Weight)<0.5){
    const myobj={sid: obj.sid,reason: "Load"};
    needs_maintainance.push(myobj);
    const dataobj={ key: obj.sid,color: "rose", tooltip: "Downtime" };
    data.push(dataobj);
    cnt_downtime+=1;
    cnt_down_load+=1;
  }

  if(parseInt(obj.Volume)<2){
    const myobj={sid: obj.sid,reason: "Flow"};
    needs_maintainance.push(myobj);
    const dataobj={ key: obj.sid,color: "rose", tooltip: "Downtime" };
    data.push(dataobj);
    cnt_downtime+=1;
    cnt_down_flow+=1;
  }

  if(parseInt(obj.Pressure)> 3){
    const myobj={sid: obj.sid,reason: "Pressure"};
    needs_maintainance.push(myobj);
    const dataobj={ key: obj.sid,color: "rose", tooltip: "Downtime" };
    data.push(dataobj);
    cnt_downtime+=1;
    cnt_down_pressure+=1;
  }

  sumLoad += parseInt(obj.Weight);
  sumPower += parseInt(obj.Power);
  sumPressure += parseInt(obj.Pressure);
  sumFlow += parseInt(obj.Volume);
  const dataobj={ key: obj.sid,color: "emerald", tooltip: "Operational" };
  data.push(dataobj);

});

avg_load_consumption=(cnt_down_load/cnt)*100;
avg_power_consumption=(cnt_down_power/cnt)*100;
avg_flow_consumption=(cnt_down_flow/cnt)*100;
avg_pressure_consumption=(cnt_down_pressure/cnt)*100;

function addCommasToNumber(number: number) {
  // Convert the number to a string
  let numString = number.toString();
  
  // Use regex to add commas to the string representation of the number
  numString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return numString;
}

function App() {
  return (
    <>
    <div className="text-left">
      <div className="grid grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-6">Load Sensor</h2>

          <Card className="max-w-lg mb-6">
            <Title>Average</Title>
            <DonutChart
              className="mt-6 mb-6"
              data={[
                {
                  name: 'Down',
                  userScore: avg_load_consumption,
                },
                {
                  name: 'Operating',
                  userScore: 100 - avg_load_consumption,
                }
              ]}
              category="userScore"
              index="name"
              colors={["green", "slate"]}
              label={`${(avg_load_consumption).toFixed()}%`}
            />
          </Card>

           <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Load</Text>
            <Metric>{ addCommasToNumber(sumLoad) } KG</Metric>
          </Card>
          {/*<Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Budget</Text>
            <Metric>${ addCommasToNumber(factorydata.avg_load_consumption) }</Metric>
          </Card> */}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Power Sensor</h2>
          <Card className="max-w-lg mb-6">
            <Title>Average</Title>
            <DonutChart
              className="mt-6 mb-6"
              data={[
                {
                  name: 'Down',
                  userScore: avg_power_consumption,
                },
                {
                  name: 'Operating',
                  userScore: 100 - avg_power_consumption,
                }
              ]}
              category="userScore"
              index="name"
              colors={["green", "slate"]}
              label={`${(avg_power_consumption).toFixed()}%`}
            />
          </Card>
           <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Power</Text>
            <Metric>{ addCommasToNumber(sumPower) } Watt</Metric>
          </Card>
          {/*<Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Budget</Text>
            <Metric>${ addCommasToNumber(factorydata.avg_flow_consumption) }</Metric>
          </Card> */}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Flow Sensor</h2>
          <Card className="max-w-lg mb-6">
            <Title>Average</Title>
            <DonutChart
              className="mt-6 mb-6"
              data={[
                {
                  name: 'Down',
                  userScore: avg_flow_consumption,
                },
                {
                  name: 'Operating',
                  userScore: 100 - avg_flow_consumption,
                }
              ]}
              category="userScore"
              index="name"
              colors={["green", "slate"]}
              label={`${(avg_flow_consumption).toFixed()}%`}
            />
          </Card>
           <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Flow</Text>
            <Metric>{ addCommasToNumber(sumFlow) } L</Metric>
          </Card>
         {/* <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Budget</Text>
            <Metric>${ addCommasToNumber(dataOppenheimer.budget) }</Metric>
          </Card> */}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Pressure Sensor</h2>
          <Card className="max-w-lg mb-6">
            <Title>Average</Title>
            <DonutChart
              className="mt-6 mb-6"
              data={[
                {
                  name: 'Down',
                  userScore: avg_pressure_consumption,
                },
                {
                  name: 'Operating',
                  userScore: 100 - avg_pressure_consumption,
                }
              ]}
              category="userScore"
              index="name"
              colors={["green", "slate"]}
              label={`${(avg_pressure_consumption).toFixed()}%`}
            />
          </Card>
           <Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Pressure</Text>
            <Metric>{ addCommasToNumber(sumPressure) } Bar</Metric>
          </Card>
          {/*<Card className="max-w-xs mx-auto mb-6" decoration="top" decorationColor="indigo">
            <Text>Budget</Text>
            <Metric>${ addCommasToNumber(dataOppenheimer.budget) }</Metric>
          </Card> */}
        </div>
      </div>
      <Card className="mt-8">
        <Title>Load Sensor (KG/hr)   <Badge>live</Badge></Title>
        <LineChart
          className="mt-6"
          data={chartData}
          index="sid"
          categories={["Load"]}
          colors={["pink"]}
          yAxisWidth={120}
          valueFormatter={addCommasToNumber}
        />
      </Card>
      <Card className="mt-8">
        <Title>Power Sensor (Watt/hr)   <Badge>live</Badge></Title>
        <LineChart
          className="mt-6"
          data={chartData}
          index="sid"
          categories={["Power"]}
          colors={["gray"]}
          yAxisWidth={120}
          valueFormatter={addCommasToNumber}
        />
      </Card>
      <Card className="mt-8">
        <Title>Pressure Sensor (Bar/hr)   <Badge>live</Badge></Title>
        <LineChart
          className="mt-6"
          data={chartData}
          index="sid"
          categories={["Pressure"]}
          colors={["blue"]}
          yAxisWidth={120}
          valueFormatter={addCommasToNumber}
        />
      </Card>
      <Card className="mt-8">
        <Title>Flow Sensor (L/min)   <Badge>live</Badge></Title>
        
        <LineChart
          className="mt-6"
          data={chartData}
          index="sid"
          categories={["Flow"]}
          colors={["purple"]}
          yAxisWidth={120}
          valueFormatter={addCommasToNumber}
        />
      </Card>

    <Card className="max-w-xs mt-8">
        <Title>Machines needing Maintainance</Title>
        <List>
          {needs_maintainance.map((item) => (
            <ListItem key={item.sid}>
              <span>{item.sid}</span>
              <span>{item.reason}</span>
            </ListItem>
          ))}
        </List>
      </Card>

  <Card className="max-w-sm mt-8">
    <Title>Status</Title>
    <Text>Machines Nov 2023</Text>
    <Flex justifyContent="end" className="mt-4">
      <Text>{(((cnt-cnt_downtime)/cnt)*100).toFixed()}% Operational</Text>
    </Flex>
    <Tracker data={data} className="mt-2" />
  </Card>

    </div>
    </>
  )
}

export default App
