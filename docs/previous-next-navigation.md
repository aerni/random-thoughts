# Previous & Next Post Navigation

## Overview

Each article page links to the previous and next post in the `artikel` collection, letting readers move between posts without returning to the blog listing.

## How It Works

Statamic's `{{ collection:previous }}` and `{{ collection:next }}` Antlers tags return the adjacent entry relative to the current page, based on the collection's sort order (`date:asc`).

```antlers
{{ collection:previous in="artikel" sort="date:asc" limit="1" }}
    <a href="{{ url }}">{{ title }}</a>
{{ /collection:previous }}

{{ collection:next in="artikel" sort="date:asc" limit="1" }}
    <a href="{{ url }}">{{ title }}</a>
{{ /collection:next }}
```

Inside the tag pair, all entry fields are available: `{{ title }}`, `{{ url }}`, `{{ date }}`, `{{ image }}`, etc.

If there is no previous or next post (i.e. you are at the first or last entry), the tag renders nothing — no conditional needed.

## Template Location

The navigation is rendered at the bottom of `resources/views/post.antlers.html`.

## Changing Sort Order

The sort order must match the `{{ collection:artikel sort="date:asc" }}` used on the blog listing page. If you change the listing sort, update both tags here to match.
