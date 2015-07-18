<?php

class PhotoGallery extends Eloquent {

	protected $fillable = ['title', 'short_title', 'slug', 'sort_pos'];

	protected $hidden = ['pivot'];
	public $table = 'photo_galleries';
	public $timestamps = false;

	public function entries()
	{
		return $this->belongsToMany('PhotoEntry', 'photo_galleries_entries', 'gallery_id', 'entry_id')
								->withPivot('sort_pos as sort_pos', 'gallery_id as gallery_id')
								->orderBy('sort_pos');
	}

}