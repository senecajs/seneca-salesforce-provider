/* Copyright © 2021 Seneca Project Contributors, MIT License. */

import * as jsforce from "jsforce";
import * as fs from "fs";
import * as path from "path";

type SalesforceConnectionOptions = {};

function SalesforceConnection(this: any, _options: any) {
  const seneca: any = this;

  seneca
    .message("role:entity,cmd:load,name:account", load_account)
    .message("role:entity,cmd:save,name:account ", save_account);

  seneca.make("sys","user", closeConnection);

  //Access salesforce credentials
  const cred = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../cred.json")).toString()
  );

  async function load_account(): Promise<jsforce.Connection> {
    let conn = new jsforce.Connection({
      loginUrl: cred.instance_url,
    });
    await conn.login(cred.username, cred.password);
    return conn;
  }

  async function closeConnection(conn: any): Promise<void> {
    await conn.logout();
    return;
  }

  const soql = `
    SELECT Id,
    Name
    FROM Account`;

  async function save_account(this: any, msg: any) {
    const conn = await load_account();
    const accounts = await conn.query(soql);
    console.log(`${accounts.totalSize} records returned from Salesforce.`);

    const accountToUpdate: any = accounts.records.find(
      (x: any) => x.Name === "Testing Account Name"
    );
    if (accountToUpdate) {
      const response: any = await conn
        .sobject("Account")
        .update({ Id: accountToUpdate.Id, Name: "Voxgig Tech Comp" });
      if (response.success) {
        let data: any = response.data;
        console.log(data);
      } else {
        console.error(response.errors[0]);
      }
    }
    closeConnection(conn);
  }

  seneca.prepare(async function (this: any) {
    let out = await this.post(
      "sys:provider,get:key,provider:salesforce,key:api"
    );
    if (!out.ok) {
      this.fail("api-key-missing");
    }

    let config = {
      auth: out.value,
    };

    return config;
  });
}

// Default options.
const defaults: SalesforceConnectionOptions = {
  debugger: false,
};

Object.assign(SalesforceConnection, { defaults });

export default SalesforceConnection;

if ("undefined" !== typeof module) {
  module.exports = SalesforceConnection;
}
