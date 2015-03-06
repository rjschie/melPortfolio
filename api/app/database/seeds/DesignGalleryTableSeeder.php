<?php

class DesignGalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('design_galleries')->delete();
		DB::unprepared("ALTER TABLE `design_galleries` AUTO_INCREMENT = 1;");

		$arr = [
			['title'=>'Dr. Martens Brand Platform','short_title'=>'Dr. Martens', 'slug'=>'docs'],
			['title'=>'Valise - A Travel App', 'short_title'=>'Valise', 'slug'=>'valise'],
			['title'=>'UNPACK Seattle', 'short_title'=>'UNPACK', 'slug'=>'unpack'],
			['title'=>'Sorted', 'short_title'=>'Sorted', 'slug'=>'sorted'],
			['title'=>'Typography', 'short_title'=>'Typography', 'slug'=>'typography'],
			['title'=>'Subsplash - Internship Work','short_title'=>'Subsplash', 'slug'=>'subsplash'],
			['title'=>'Pill Bottle Redesign', 'short_title'=>'Pill Bottle Redesign', 'slug'=>'pbr'],
			['title'=>'Path - Symbol Set', 'short_title'=>'Path', 'slug'=>'path']
		];

		foreach($arr as $gall) {
			DesignGallery::create([
				'title' => $gall['title'],
				'short_title' => $gall['short_title'],
				'slug' => $gall['slug'],
				'image' => $gall['slug'].'.jpg'
			]);
		}
	}
}