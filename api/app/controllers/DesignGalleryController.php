<?php

use Illuminate\Support\Facades\Response;

class DesignGalleryController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(DesignGallery::orderBy('sort_pos')->get(), 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Display one resource.
	 *
	 * @param  mixed  $gallery_slug
	 * @return Response
	 */
	public function show($gallery_slug)
	{
		if(is_numeric($gallery_slug)) {
			$gallery = DesignGallery::findOrFail($gallery_slug);
		} else {
			$gallery = DesignGallery::where('slug', '=', $gallery_slug)->firstOrFail();
		}

		return Response::json($gallery->entries, 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		try {

			extract(Input::all());

			if (empty($new_title)) {
				throw new Exception("Missing title.");
			}
			if (empty($new_short_title)) {
				throw new Exception("Missing short_title.");
			}
			if (empty($new_slug)) {
				throw new Exception("Missing slug.");
			}
			if(empty($new_image)) {
				throw new Exception("Missing image.");
			}

			file_put_contents(
				dirname(base_path()) . '/dev/uploads/design-home/' . $new_image['name'],
				base64_decode(substr($new_image['data'], strpos($new_image['data'], ",")+1))
			);
			$newGallery = DesignGallery::create([
				'title'				=> $new_title,
				'short_title' => $new_short_title,
				'slug'				=> $new_slug,
				'image'				=> $new_image['name'],
				'sort_pos'		=> DesignGallery::max('sort_pos')+1
			]);


		} catch(Exception $e) {

			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
		}

		return Response::json($newGallery, 201, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Update a resource with given information.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		try {

			$gallery = DesignGallery::findOrFail($id);

			if (Input::has('title')) {
				$gallery->title = Input::get('text');
			}
			if(Input::has('short_title')) {
				$gallery->short_title = Input::get('short_title');
			}
			if(Input::has('slug')) {
				$gallery->slug = Input::get('slug');
			}

			$gallery->save();

		} catch(Exception $e) {

			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
		}

		return Response::make("", 200);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  mixed  $gallery_slug
	 * @return Response
	 */
	public function destroy($gallery_slug)
	{

		if(is_numeric($gallery_slug)) {
			$gallery = DesignGallery::findOrFail($gallery_slug);;
		} else {
			$gallery = DesignGallery::where('slug', '=', $gallery_slug)->firstOrFail();
		}

		// TODO: find image and delete it



		$gallery->delete();
	}


}
