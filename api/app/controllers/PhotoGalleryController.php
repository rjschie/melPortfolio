<?php

class PhotoGalleryController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(PhotoGallery::orderBy('sort_pos', 'asc')->get(), 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $gallery_slug
	 * @return Response
	 */
	public function show($gallery_slug)
	{
		if(is_numeric($gallery_slug)) {
			$gallery = PhotoGallery::with('entries')->findOrFail($gallery_slug);
		} else {
			$gallery = PhotoGallery::where('slug', '=', $gallery_slug)->with('entries')->firstOrFail();
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

			$newGallery = PhotoGallery::create([
				'title'				=> $new_title,
				'short_title' => $new_short_title,
				'slug'				=> $new_slug,
				'sort_pos'		=> PhotoGallery::max('sort_pos')+1
			]);


		} catch(Exception $e) {

			return Response::make(['error' => $e->getMessage()], 500);
		}

		return Response::json($newGallery, 201, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $gallery_slug
	 * @return Response
	 */
	public function update($gallery_slug)
	{
		try {
			if(is_numeric($gallery_slug)) {
				$gallery = PhotoGallery::findOrFail($gallery_slug);
			} else {
				$gallery = PhotoGallery::where('slug', '=', $gallery_slug)->firstOrFail();
			}

			extract(Input::all());

			if (!empty($title)) {
				$gallery->title = $title;
			}
			if(!empty($short_title)) {
				$gallery->short_title = $short_title;
			}
			if(!empty($slug)) {
				$gallery->slug = $slug;
			}

			$gallery->save();

		} catch(Exception $e) {

			return Response::make(['error' => $e->getMessage()], 500);
		}

		return Response::json($gallery, 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $gallery_slug
	 * @return Response
	 */
	public function destroy($gallery_slug)
	{
		if(is_numeric($gallery_slug)) {
			$gallery = PhotoGallery::findOrFail($gallery_slug);
		} else {
			$gallery = PhotoGallery::where('slug', '=', $gallery_slug)->firstOrFail();
		}

		$gallery->delete();
	}


	/**
	 * Update the `sort_pos` for the galleries
	 *
	 * @return Response
	 */
	public function reorder()
	{

		DB::transaction(function() {

			$data = Input::all();
			$galleries = PhotoGallery::all(['id','sort_pos']);

			foreach($galleries as $gallery) {
				$gallery->sort_pos = $data[$gallery->id]['sort_pos'];

				if( ! $gallery->save() ) {
					throw new \Exception('Gallery not able to be sorted.');
				}
			}
		});
	}


	/**
	 * Return semi-random listing of photos
	 *
	 * @return Response
	 */
	public function random()
	{
		$result = [];
		$sortArr = PhotoEntry::randomMatrix();
		$photoDBRes = PhotoEntry::all();
		$photos = $photoDBRes->keyBy('id');

		foreach($sortArr as $value) {
			$result[] = $photos[$value];
		}

		return Response::json($result, 200, [], JSON_NUMERIC_CHECK);
	}

}
