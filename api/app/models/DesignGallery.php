<?php

class DesignGallery extends Eloquent {

	protected $fillable = [ 'title', 'short_title', 'slug','image_url', 'sort_pos' ];

	protected $hidden = ['pivot'];
	public $table = 'design_galleries';
	public $timestamps = false;

	public function entries()
	{
		return $this->belongsToMany('DesignEntry', 'design_galleries_entries', 'gallery_id', 'entry_id')
								->withPivot('sort_pos as sort_pos', 'gallery_id as gallery_id')
								->orderBy('sort_pos');
	}

}