<?php

class DesignEntry extends Eloquent {

	protected $fillable = [
		'title',
		'subtitle',
		'body',
		'footer',
		'bgColor',
		'image',
		'video',
		'type'
	];

	protected $hidden = ['pivot'];
	public $table = 'design_entries';
	public $timestamps = false;

	public function galleries()
	{
		return $this->belongsToMany('DesignGallery', 'design_galleries_entries', 'entry_id', 'gallery_id');
	}

}