![Seneca Salesforce-Provider](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Salesforce-Provider_ is a plugin for [Seneca](http://senecajs.org)

Provides access to the Salesforce Account sObject API using the Seneca _provider_
convention. Salesforce Account sObject entities are represented as Seneca entities so that
they can be accessed using the Seneca entity API and messages.

Requests are handled by the [Salesforce Account sObject SDK](https://github.com/voxgig-sdk/salesforce-sdk),
which is generated from the API's OpenAPI specification. This plugin is
generated from the same specification by
[@voxgig/sdkgen](https://github.com/voxgig/sdkgen) — do not edit it by hand,
change the model and regenerate.

See [seneca-entity](https://github.com/senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html)
for more details on the Seneca entity API.

[![build](https://github.com/senecajs/seneca-salesforce-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-salesforce-provider/actions/workflows/build.yml)

| This open source module is sponsored and supported by [Voxgig](https://voxgig.com). |
| --- |


<!--START:SECTION:intro-->
<!--END:SECTION:intro-->


## Documentation

Full documentation lives in [`doc/`](doc/README.md) and follows the
[Diátaxis](https://diataxis.fr) framework:

| Document | Purpose |
| -------- | ------- |
| [Tutorial](doc/tutorial.md) | Start here. Build a working script from an empty folder. |
| [How-to guides](doc/how-to.md) | Recipes for specific tasks. |
| [Reference](doc/reference.md) | Every pattern, entity, option and export. |
| [Explanation](doc/explanation.md) | Why the plugin is designed this way. |


## Quick Example

```js
const Seneca = require('seneca')

const seneca = Seneca()
  .use('promisify')
  .use('entity')
  .use('env', { var: { $SALESFORCE_APIKEY: '' } })
  .use('provider', {
    provider: {
      salesforce: {
        keys: { apikey: { value: '$SALESFORCE_APIKEY' } },
      },
    },
  })
  .use('@seneca/salesforce-provider')

await seneca.ready()

const accounts = await seneca
  .entity('provider/salesforce/account').list$()
const account = await seneca
  .entity('provider/salesforce/account').load$('some-id')
```


## Install

```sh
npm install @seneca/salesforce-provider
```

This plugin expects the Seneca host framework to be present:

```sh
npm install seneca seneca-entity seneca-promisify @seneca/provider @seneca/env
```


## Options

| Option | Type | Description |
| --- | --- | --- |
| `sdk` | object | Passed straight to the `SalesforceSDK` constructor. Most usefully `base`, to point at a server. |
| `test` | boolean | Run the SDK in offline test mode (in-memory mock transport). |
| `testopts` | object | Seed and options for the mock, used only when `test` is true. |


## Entities

Each API entity is exposed as a Seneca entity under
`provider/salesforce/<entity>`.

| Seneca entity | Commands | Fields |
| --- | --- | --- |
| `provider/salesforce/account` | `list$`, `load$`, `save$`, `remove$` | — |


## Action Patterns

Every message pattern this plugin registers. The entity actions are the ones
`seneca-entity` dispatches to when you call `list$` / `load$` / `save$` /
`remove$` on a canon below — you rarely post them by hand, but they are what
appears in a Seneca log, and a plugin that documents one of nine is a plugin
whose logs cannot be read.

| Pattern | Description |
| --- | --- |
| `sys:provider,provider:salesforce,get:info` | Plugin and SDK version information. |
| `sys:entity,cmd:list,zone:provider,base:salesforce,name:account` | List records. |
| `sys:entity,cmd:load,zone:provider,base:salesforce,name:account` | Load one record. |
| `sys:entity,cmd:save,zone:provider,base:salesforce,name:account` | Create or update a record. |
| `sys:entity,cmd:remove,zone:provider,base:salesforce,name:account` | Remove a record. |



## More Examples

### Offline testing

The SDK ships an in-memory mock transport, so this plugin can be exercised
with no server:

```js
.use('@seneca/salesforce-provider', { test: true, testopts: { entity: { ... } } })
```

`testopts` is passed straight to the SDK's test constructor; `entity`
seeds the mock store. See `test/seed.js` for the shape.


## Motivation

Applications rarely talk to one external service, and each service usually
arrives with its own client library, authentication style and error
conventions. That variety leaks into application code and makes it harder to
test.

The Seneca provider convention removes the variety: every external service
becomes a Seneca entity reached with `list$`, `load$`, `save$` and
`remove$`, so application code has one shape regardless of what it talks to.

The SDK underneath arrives at a similar conclusion from the other side — it
deliberately exposes entities rather than HTTP routes. This plugin is the
short bridge between the two.


## Support

- Issues and bugs: [GitHub issues](https://github.com/senecajs/seneca-salesforce-provider/issues)
- Seneca community: [senecajs.org](http://senecajs.org)


## API

### Plugin export: `SalesforceProvider/sdk`

Returns the configured `SalesforceSDK` instance, for the operations
the entity API does not cover:

```js
const sdk = seneca.export('SalesforceProvider/sdk')()
```


## Contributing

This plugin is GENERATED. Changes belong in the SDK project's model and
components, not here — anything edited in this repository is overwritten by
the next generation run.

The [Senecajs org](http://senecajs.org) encourages open participation. If you
feel you can help in any way, be it with bug reporting, documentation,
examples, extra testing, or new features, please get in touch.


## Background

Generated by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen) from the
Salesforce Account sObject API definition, against the
[@voxgig-sdk/salesforce](https://www.npmjs.com/package/@voxgig-sdk/salesforce) SDK.
