<?php

class VideoController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Video::orderBy('sort_pos')->get(), 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
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

			if(empty($title)) {
				throw new Exception("Must enter title.");
			}

			if(empty($new_image)) {
				throw new Exception( "Must select a poster image." );
			}
			if(empty($video_url)) {
				throw new Exception( "Must select a video." );
			}

			// Upload Poster Image
			$new_image = json_decode($new_image, true);
			$imageLoc = 'uploads/videos/' . $new_image['name'];
			try {
				file_put_contents(
					dirname( base_path() ) . '/dev/' . $imageLoc,
					base64_decode( substr( $new_image[ 'data' ],
						strpos( $new_image[ 'data' ], "," ) + 1 ) )
				);
			} catch(Exception $e) {
				return Response::json( ['error' => "Couldn't upload image: ".$e->getMessage()], 500 );
			}

			// Upload Video
			try {
				$destinationPath = dirname(base_path()) . '/dev/uploads/videos';

				if( ! $video_url->move( $destinationPath, $video_url->getClientOriginalName() ) ) {
					return Response::json(["error" => "Couldn't move video."], 400);
				}
			} catch(Exception $e) {
				return Response::json( ['error' => "Couldn't upload video: ".$e->getMessage()], 500 );
			}

			$video = Video::create([
				'title'	=> $title,
				'image_url'	=> $imageLoc,
				'video_url'	=> 'uploads/videos/' . $video_url->getClientOriginalName(),
				'sort_pos' => Video::max('sort_pos')+1
			]);

		} catch(Exception $e) {
			return Response::json( [ 'error' => $e->getMessage() ], 500 );
		}

		return Response::json($video, 201, [], JSON_NUMERIC_CHECK);
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
			$video = Video::findOrFail($id);

			extract(Input::all());

			if(!empty($title)) {
				$video->title = $title;
			}
			if(!empty($video_url)) {
				$video->video_url = $video_url;
			}

			if(!empty($new_image)) {
				// TODO: uncomment - fix first
//				if(file_exists(dirname(base_path()) . '/dev/uploads/design-home/' . $video->image_url)) {
//					unlink(dirname(base_path()) . '/dev/uploads/design-home/' . $video->image_url);
//				}

				$imageLoc = 'uploads/videos/' . $new_image['name'];
				file_put_contents(
					dirname(base_path()) . '/dev/' . $imageLoc,
					base64_decode(substr($new_image['data'], strpos($new_image['data'], ",")+1))
				);
				$video->image_url = $imageLoc;
			}

			$video->save();

		} catch(Exception $e) {

			return Response::make(['error' => $e->getMessage()], 500);
		}

		return Response::json($video, 200, [], JSON_NUMERIC_CHECK);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$video = Video::findOrFail($id);

		//TODO: delete image and vid

		$video->delete();
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
			$videos = Video::all(['id','sort_pos']);

			foreach($videos as $video) {
				$video->sort_pos = $data[$video->id]['sort_pos'];

				if( ! $video->save() ) {
					throw new \Exception('Gallery not able to be sorted.');
				}
			}

		});
	}


}
