## How to contribute

There are a few guidelines that we need contributors to follow so that we can have a chance of keeping on top of things.

### Getting Started

- Fork the repository

1 - Install all the dependencies, recomend use `yarn`

```bash
yarn install
```

2 - Set the `env` vars

First make a copy of `.env.example` and rename to `.env` now you need to set the values;

**Supabase**
SUPABASE_PROJECT_URL=
SUPABASE_ANON_PUBLIC_KEY=

To get supabase information, follow the next link [https://supabase.com/docs/guides/with-vue-3#get-the-api-keys](https://supabase.com/docs/guides/with-vue-3#get-the-api-keys)

**Mapbox**
MAPBOX_ACCESS_TOKEN=

To get Mapbox access token go to [https://account.mapbox.com/](https://account.mapbox.com/) and in the bottom of the page, copy the token and set it on `.env` file.

3 - Run the app

```bash
quasar dev
```

### Submitting Changes

- Push your changes to your fork
- Submit a pull request

### Additional Resources

The idea is that the code is as readable as possible for everyone, not just for those who come from quasar.

You can check the quasar cofiguration guide [here](https://quasar.dev/start/vs-code-configuration#introduction).
