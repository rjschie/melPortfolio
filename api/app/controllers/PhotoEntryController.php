<?php

class PhotoEntryController extends \BaseController {

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		try {

			extract(Input::all());

			if(empty($gallery_id)) {
				throw new Exception("Must select a gallery.");
			}
			if(empty($title)) {
				throw new Exception("Must enter title.");
			}
			if(empty($new_image)) {
				throw new Exception("Must select an image.");
			}

			$gallery = PhotoGallery::where('id', '=', $gallery_id)->get(['slug'])[0];
			$imageLoc = 'uploads/photography/' . $gallery->slug . '/' . $new_image['name'];
			try {
				file_put_contents(
					dirname( base_path() ) . '/dev/' . $imageLoc,
					base64_decode( substr( $new_image[ 'data' ],
						strpos( $new_image[ 'data' ], "," ) + 1 ) )
				);
			} catch(Exception $e) {
				return Response::make(['error' => "Couldn't upload image: ".$e->getMessage()], 500);
			}
			$entry = PhotoEntry::create([
				'title'	=> $title,
				'image_url'	=> $imageLoc,
			]);

			$galleryEntry = PhotoGalleryEntry::create([
				'gallery_id'	=> $gallery_id,
				'entry_id'		=> $entry['id'],
				'sort_pos'		=> PhotoGalleryEntry::where('gallery_id', $gallery_id)->max('sort_pos')+1
			]);

			$entry->gallery_id = $galleryEntry->gallery_id;
			$entry->sort_pos = $galleryEntry->sort_pos;

		} catch(Exception $e) {
			return Response::make(['error' => $e->getMessage()], 500);
		}

		return Response::json($entry, 201, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		try {
			$galleryEntry = PhotoGalleryEntry::where('entry_id','=',$id)->get()[0];
			$entry = PhotoEntry::findOrFail($id);

			extract(Input::all());

			if(!empty($gallery_id)) {
				$galleryEntry->gallery_id = $gallery_id;
				$galleryEntry->sort_pos = PhotoGalleryEntry::where('gallery_id', $gallery_id)->max('sort_pos')+1;
			}
			if (!empty($title)) {
				$entry->title = $title;
			}
			if(!empty($new_image)) {
				$gallery = PhotoGallery::where('id', '=', $galleryEntry->gallery_id)->get(['slug'])[0];

				// TODO: uncomment
//				if(file_exists(dirname(base_path()) . '/dev/' . $entry->image_url)) {
//					unlink(dirname(base_path()) . '/dev/' . $entry->image_url);
//				}

				$imageLoc = 'uploads/photography/' . $gallery->slug . '/' . $new_image['name'];
				file_put_contents(
					dirname(base_path()) . '/dev/' . $imageLoc,
					base64_decode(substr($new_image['data'], strpos($new_image['data'], ",")+1))
				);
				$entry->image_url = $imageLoc;
			}

			$entry->save();
			$galleryEntry->save();

			$entry->gallery_id = $galleryEntry->gallery_id;
			$entry->sort_pos = $galleryEntry->sort_pos;

		} catch(Exception $e) {

			return Response::make(['error' => $e->getMessage()], 500);
		}

		return Response::json($entry, 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$entry = PhotoEntry::findOrFail($id);

		//TODO: delete image

		$entry->delete();
	}


	/**
	 * Update the `sort_pos` for the entries
	 *
	 * @return Response
	 */
	public function reorder()
	{

		DB::transaction(function() {

			$data = Input::all();
			$photoEntries = PhotoGalleryEntry::where('gallery_id', '=', $data['gallery_id'])->get();

			foreach($photoEntries as $entry) {
				$entry->sort_pos = $data['entries'][$entry['entry_id']]['sort_pos'];
				if( ! $entry->save() ) {
					throw new \Exception('Entry not able to be sorted.');
				}
			}

		});
	}


}
