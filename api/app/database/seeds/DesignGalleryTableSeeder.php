<?php

class DesignGalleryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('design_galleries')->delete();
		DB::unprepared("ALTER TABLE `design_galleries` AUTO_INCREMENT = 1;");

		$arr = [
			['title'=>'Dr. Martens Brand Platform','short_title'=>'Dr. Martens', 'slug'=>'docs', 'sort_pos'=>1],
			['title'=>'Valise - A Travel App', 'short_title'=>'Valise', 'slug'=>'valise', 'sort_pos'=>2],
			['title'=>'SPD Infographic', 'short_title'=>'SPD Infographic', 'slug'=>'infographic', 'sort_pos'=>3],
			['title'=>'Subsplash - Internship Work','short_title'=>'Subsplash', 'slug'=>'subsplash', 'sort_pos'=>4],
			['title'=>'Sorted', 'short_title'=>'Sorted', 'slug'=>'sorted', 'sort_pos'=>5],
			['title'=>'Typography', 'short_title'=>'Typography', 'slug'=>'typography', 'sort_pos'=>6],
			['title'=>'Path - Symbol Set', 'short_title'=>'Path', 'slug'=>'path', 'sort_pos'=>7],
			['title'=>'UNPACK Seattle', 'short_title'=>'UNPACK', 'slug'=>'unpack', 'sort_pos'=>8],
			['title'=>'Pill Bottle Redesign', 'short_title'=>'Pill Bottle Redesign', 'slug'=>'pbr', 'sort_pos'=>9]
		];

		foreach($arr as $gall) {
			DesignGallery::create([
				'title' => $gall['title'],
				'short_title' => $gall['short_title'],
				'slug' => $gall['slug'],
				'image' => $gall['slug'].'.jpg',
				'sort_pos' => $gall['sort_pos']
			]);
		}
	}
}