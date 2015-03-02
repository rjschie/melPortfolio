<?php

class DesignGalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('design_galleries')->delete();
		DB::unprepared("ALTER TABLE `design_galleries` AUTO_INCREMENT = 1;");

		$arr = [
			['title'=>'Dr. Martens Brand Platform','short_title'=>'Dr. Martens', 'slug'=>'docs'],
			['title'=>'Valise - A Travel App', 'short_title'=>'Valise', 'slug'=>'valise'],
			['title'=>'Sorted', 'short_title'=>'Sorted', 'slug'=>'sorted'],
			['title'=>'Typography', 'short_title'=>'Typography', 'slug'=>'typography'],
			['title'=>'Path - Symbol Set', 'short_title'=>'Path', 'slug'=>'path'],
			['title'=>'Subsplash - Internship Work','short_title'=>'Subsplash', 'slug'=>'subsplash'],
			['title'=>'Acoba Family Coffee House', 'short_title'=>'Acoba Family Coffee', 'slug'=>'acoba'],
			['title'=>'Succulent Container Gardens', 'short_title'=>'Succulents', 'slug'=>'succulents'],
			['title'=>'Pill Bottle Redesign', 'short_title'=>'Pill Bottle Redesign', 'slug'=>'pbr']
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