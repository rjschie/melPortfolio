<?php

class DesignEntry extends Eloquent {

	protected $fillable = [ 'design_gallery_id', 'title','location', 'is_vid' ];

	public $table = 'design_entries';
	public $timestamps = false;

	public function galleries()
	{
		return $this->belongsToMany('DesignGallery', 'design_galleries_entries', 'gallery_id', 'entry_id');
	}

}