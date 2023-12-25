### Predictive Maintainance of Industrial Iot based on Resources consumption by systems/Machines

- used Contiki-ng for creating Virtual Wireless sensor network.
- used Hyperledger fabric private blockchain to store the generated data securely.
- You can find all the source codes that were used for generating data and also to create a hyperledger fabric blockchain and pushing data into it in the /Sourcecodes folder.
- This data is being retrieved from the blockchain and pushed into a json file (could've used Couch DB).
- Visualized this json data in a React.js - vite web app which updates in real time (used Tremor library for data visualizations).

Here's the Recording: [ [LINK] ](https://drive.google.com/file/d/1vpImf_KRewYAJBvrouvp45aJOyF5-rRX/view?usp=sharing)

Project Process Explained Here: [ [LINK] ](https://docs.google.com/document/d/1fIFp-tnCwqfGcxhQhphatMdiDA00Gz4mq8_m2nHcry8/edit?usp=sharing)

Running the Dashboard Locally :

* Insatlling all dependencies run ``` npm install ```
* Change the path of the 'factorydata' variable in the App.tsx file to where your data.json file is at.
* Now run ``` npm run dev ``` , you are all set :)

🌸 This was a Group Project part of Iot curriculam.
