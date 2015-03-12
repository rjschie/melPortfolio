<?php

class DesignGallery extends Eloquent {

	protected $fillable = [ 'title', 'short_title', 'slug','image' ];

	public $table = 'design_galleries';
	public $timestamps = false;

	public function entries()
	{
		return $this->belongsToMany('DesignEntry', 'design_galleries_entries', 'gallery_id', 'entry_id');
	}

}