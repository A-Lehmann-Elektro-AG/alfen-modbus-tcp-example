/*
  Alfen Modbus TCP Example

  author:   Marco Lehmann, marco.lehmann@lehmann.ch, A. Lehmann Elektro AG
  date:     13.07.2022
*/


import ModbusRTU from 'modbus-serial';

const client = new ModbusRTU();
client.setID(1);
client.setTimeout(2000);

// local Alfen IP
const alfenIp = "192.168.134.109";

const getModbusSlaveMaxCurrent = async() => {
  try {
    await client.connectTCP(alfenIp, { port: 502 });
    const data = await client.readHoldingRegisters(1210, 2);
    
    // convert buffer to float
    var buf = new ArrayBuffer(4);
    var ints = new Uint16Array(buf);
    ints[0] = data.data[1];
    ints[1] = data.data[0];
    
    var floats = new Float32Array(buf);
    client.close();

    return floats[0]; 
  } catch (err) {
    console.log(err);
  }
}

const setModbusSlaveMaxCurrent = async(value) => {
  try {
    // convert float to buffer
    let farr = new Float32Array(1);
    farr[0] = value;
    var barr = new Uint16Array(farr.buffer);

    await client.connectTCP(alfenIp, { port: 502 });
    await client.writeRegisters(1210, [barr[1], barr[0]]);
    client.close();
    return "success";
  } catch (err) {
    console.log(err);
  }
}

// setModbusSlaveMaxCurrent(20).then(res => console.log(res));
getModbusSlaveMaxCurrent().then(res => console.log(res));