<?php

use Illuminate\Support\Facades\Route;
use Statamic\Facades\Term;

Route::view('static/blog', 'static.blog');
Route::view('static/post', 'static.post');

Route::get('/posts/tags/{slug}', function (string $slug) {
    $term = Term::findBySlug($slug, 'tags');

    if (! $term) {
        abort(404);
    }

    return (new \Statamic\Http\Controllers\FrontendController())->index(request());
});
