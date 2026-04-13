---
name: react-router-v7
description: React Router v7 - File System Routing
---

When to use: Project uses Vite + React Router v7 with file-system routing. User asks about routing, navigation, forms, data loading, URL state. You are the expert on RRv7 file-based patterns.
Core Philosophy

RRv7 file routes = Remix migrated into React Router. Routes = files. loader/action live next to components. <Form> replaces onSubmit. Data loads before render. Progressive enhancement by default.
File System Conventions

File Path

URL

Purpose

routes/\_index.tsx

/

Index route

routes/about.tsx

/about

Basic route

routes/users.$id.tsx

/users/:id

Dynamic param

routes/users.tsx

/users

Parent layout, needs <Outlet>

routes/users.\_index.tsx

/users

Index of /users

routes/blog.$slug.tsx

/blog/:slug

Nested dynamic

routes/dashboard.settings.tsx

/dashboard/settings

Nested layout

routes/$.tsx

/\*

Catch-all route

routes/api.users.ts

/api/users

Resource route, no UI

Rules:

    _ prefix → pathless layout: routes/_auth.tsx wraps children, no URL segment
    . → nested URL segment
    $ → dynamic param
    _index.tsx → index route when parent has <Outlet>
    route.tsx + route._index.tsx = parent must render <Outlet>

Route File Structure
TSX

// routes/search.tsx
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { Form, useLoaderData, useActionData, useRouteError } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
const q = new URL(request.url).searchParams.get("q") ?? "";
return { q, results: await searchProducts(q) };
}

export async function action({ request }: ActionFunctionArgs) {
const formData = await request.formData();
await saveFilter(formData);
return redirect("/search");
}

export default function Search() {
const { results, q } = useLoaderData<typeof loader>();
const actionData = useActionData<typeof action>();
return (
<Form method="get">
<input name="q" defaultValue={q} />
<button type="submit">Search</button>
</Form>
);
}

export function ErrorBoundary() {
const error = useRouteError();
return <div>Error: {error.message}</div>;
}

Core APIs

Feature

Use When

loader

Need data before page renders. Runs on server + client

action

Handle POST/PATCH/DELETE from <Form method="post">

useLoaderData()

Read data from loader. Type with typeof loader

useActionData()

Read return from action. Show form errors

<Form>


All forms. Replaces <form onSubmit>. No FormEvent

useSubmit()

Submit form programmatically from JS

useFetcher()

Mutate without navigation. Likes, toggles

useNavigation()

Show global loading: navigation.state === 'loading'

useSearchParams()

Read/write ?q=.... URL is state

useParams()

Read $id from routes/users.$id.tsx

Link / NavLink

Internal navigation. NavLink has isActive

useNavigate()

Imperative redirect after action

redirect()

Return from loader/action to redirect

useRouteError()

Get error inside ErrorBoundary
Form Pattern - No onSubmit
TSX

export async function loader({ request }: LoaderFunctionArgs) {
const q = new URL(request.url).searchParams.get("q") ?? "";
return { q };
}

export default function Search() {
const { q } = useLoaderData<typeof loader>();
return (
<Form method="get" action="/search">
<input name="q" defaultValue={q} />
<button type="submit">Search</button>
</Form>
);
}

RR serializes name="q" to ?q=..., runs loader, re-renders. No useState, no onSubmit.
Mutation Pattern
TSX

export async function action({ request, params }: ActionFunctionArgs) {
const formData = await request.formData();
if (formData.get("intent") === "delete") {
await deletePost(params.id);
return redirect("/posts");
}
}

export default function Post() {
const fetcher = useFetcher();
return (
<fetcher.Form method="post">
<button name="intent" value="delete">
{fetcher.state === "submitting" ? "Deleting..." : "Delete"}
</button>
</fetcher.Form>
);
}

URL State Pattern
TSX

export default function Products() {
const [searchParams, setSearchParams] = useSearchParams();
const sort = searchParams.get("sort") ?? "newest";

return (
<select
value={sort}
onChange={e => setSearchParams({ sort: e.target.value })} >
<option value="newest">Newest</option>
<option value="price">Price</option>
</select>
);
}

Active Links
TSX

<NavLink
to="/about"
className={({ isActive }) => isActive ? "text-orange-500" : "text-gray-400"}

> About
> </NavLink>

Global Loading State
TSX

// root.tsx
export default function Root() {
const navigation = useNavigation();
return (
<>
{navigation.state === "loading" && <Spinner />}
<Outlet />
</>
);
}

Common Mistakes

    Using onSubmit + navigate → Use <Form method="get|post">
    Fetching in useEffect → Use loader
    useState for ?q= → Use useSearchParams or <Form>
    Manual active link logic → Use NavLink
    Missing name on inputs → <Form> skips inputs without name
    Forgetting <Outlet> → Children won't render in layout routes
    Using BrowserRouter → File routes auto-generate router via Vite plugin
    Writing FormEvent → If you see it, switch to <Form>

Setup
TypeScript

// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
export default defineConfig({
plugins: [reactRouter()],
});

Create files in app/routes/. No manual route config.
Decision Tree

    Navigate → <Link to="/path">
    Submit data → <Form method="post"> + export action
    Load data → export loader + useLoaderData()
    Control UI with URL → useSearchParams()
    Mutate without nav → useFetcher()
    Show loading → useNavigation().state
    Active link → <NavLink>

Rule: Prefer RR data APIs over useEffect + fetch. If you're writing FormEvent or onSubmit, stop and use <Form>.
