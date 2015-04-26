<?php

class DesignEntry extends Eloquent {

	protected $fillable = [
		'title',
		'subtitle',
		'body',
		'footer',
		'bgColor',
		'location',
		'type'
	];

	public $table = 'design_entries';
	public $timestamps = false;

	public function galleries()
	{
		return $this->belongsToMany('DesignGallery', 'design_galleries_entries', 'gallery_id', 'entry_id');
	}

}