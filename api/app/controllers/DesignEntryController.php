<?php

use Illuminate\Support\Facades\Response;

class DesignEntryController extends \BaseController {

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
			if(!isset($type)) {
				throw new Exception("Must define entry type.");
			}
			if(empty($title)) {
				throw new Exception("Must enter title.");
			}

			switch($type) {
				case 0: // Image Item
					if(empty($new_image)) {
						throw new Exception("Must select an image.");
					}

					$gallery = DesignGallery::where('id', '=', $gallery_id)->get(['slug'])[0];

					$imageLoc = 'uploads/' . $gallery->slug . '/' . $new_image['name'];
					try {
						file_put_contents(
							dirname( base_path() ) . '/dev/' . $imageLoc,
							base64_decode( substr( $new_image[ 'data' ],
								strpos( $new_image[ 'data' ], "," ) + 1 ) )
						);
					} catch(Exception $e) {
						return Response::make("{\"error\":\"Couldn't upload image: ".$e->getMessage()."\"}", 500);
					}
					$entry = DesignEntry::create([
						'title'	=> $title,
						'image'	=> $imageLoc,
						'type'	=> $type
					]);
					break;
				case 1: // Video Item
					if(empty($video)) {
						throw new Exception("Must select a video.");
					}
//					$entry = DesignEntry::create([
//						'title'				=> $title,
//						'image'		=> $image,
//						'type'	=> $type
//					]);
					break;
				case 2: // Text Item
					if(empty($subtitle) || empty($body) || empty($footer) || empty($bgColor)) {
						throw new Exception("Must fill in all fields.");
					}
					$entry = DesignEntry::create([
						'title' 			=> $title,
						'subtitle'		=> $subtitle,
						'body'				=> $body,
						'footer'			=> $footer,
						'bgColor'			=> $bgColor,
						'type'				=> $type
					]);
					break;
			}

			$galleryEntry = DesignGalleryEntry::create([
				'gallery_id'	=> $gallery_id,
				'entry_id'		=> $entry['id'],
				'sort_pos'		=> DesignGalleryEntry::where('gallery_id', $gallery_id)->max('sort_pos')+1
			]);

			$entry->gallery_id = $galleryEntry->gallery_id;
			$entry->sort_pos = $galleryEntry->sort_pos;

		} catch(Exception $e) {
			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
		}

		return Response::json($entry, 201, [], JSON_NUMERIC_CHECK);
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
			$galleryEntry = DesignGalleryEntry::where('entry_id','=',$id)->get()[0];
			$entry = DesignEntry::findOrFail($id);

			extract(Input::all());

			if(!empty($gallery_id)) {
				$galleryEntry->gallery_id = $gallery_id;
			}
			if(!empty($type)) {
				$entry->type = $type;
			}
			if (!empty($title)) {
				$entry->title = $title;
			}
			if(!empty($subtitle)) {
				$entry->subtitle = $subtitle;
			}
			if(!empty($body)) {
				$entry->body = $body;
			}
			if(!empty($footer)) {
				$entry->footer = $footer;
			}
			if(!empty($bgColor)) {
				$entry->bgColor = $bgColor;
			}

			if(!empty($new_image)) {
				$gallery = DesignGallery::where('id', '=', $galleryEntry->gallery_id)->get(['slug'])[0];

				// TODO: uncomment
//				if(file_exists(dirname(base_path()) . '/dev/uploads/design-home/' . $entry->image)) {
//					unlink(dirname(base_path()) . '/dev/uploads/design-home/' . $entry->image);
//				}

				$imageLoc = 'uploads/' . $gallery->slug . '/' . $new_image['name'];
				file_put_contents(
					dirname(base_path()) . '/dev/' . $imageLoc,
					base64_decode(substr($new_image['data'], strpos($new_image['data'], ",")+1))
				);
				$entry->image = $imageLoc;
			}

			$entry->save();
			$galleryEntry->save();

			$entry->gallery_id = $galleryEntry->gallery_id;
			$entry->sort_pos = $galleryEntry->sort_pos;

		} catch(Exception $e) {

			return Response::make("{\"error\":\"".$e->getMessage()."\"}", 500);
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
		$entry = DesignEntry::findOrFail($id);

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
			$designEntries = DesignGalleryEntry::where('gallery_id', '=', $data['gallery_id'])->get();

			foreach($designEntries as $entry) {
				$entry->sort_pos = $data['entries'][$entry['entry_id']]['sort_pos'];
				if( ! $entry->save() ) {
					throw new \Exception('Entry not able to be sorted.');
				}
			}

		});
	}


}
