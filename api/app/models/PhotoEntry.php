<?php

class PhotoEntry extends Eloquent {

	protected $fillable = [ 'title','image_url' ];

	protected $hidden = ['pivot'];
	public $table = 'photo_entries';
	public $timestamps = false;

	public function galleries()
	{
		return $this->belongsToMany('PhotoGallery', 'photo_galleries_entries', 'entry_id', 'gallery_id');
	}

	public static function randomMatrix() {
		$result = [];
		$galleries = PhotoGallery::orderBy('sort_pos', 'asc')->lists('id');
		$photo_galleries = [];

		$photo_galleries_length = 0;
		foreach($galleries as $i => $gallery) {
			$photo_galleries[$i] = PhotoGalleryEntry::orderBy('sort_pos', 'asc')->where('gallery_id', '=', $gallery)->lists('entry_id');
			$photo_galleries_length += count($photo_galleries[$i]);
		}

		$i = 1;
		do {
			$tempArr = [];
			for($n=0; $n < count($galleries); $n++) {
				$val = array_shift($photo_galleries[$n]);
				if ($val) {
					$tempArr[] = $val;
					$i++;
				}
			}
			shuffle($tempArr);
			$result = array_merge($result, $tempArr);
		} while($i <= $photo_galleries_length);

		return $result;
	}

}