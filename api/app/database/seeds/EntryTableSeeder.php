<?php

class EntryTableSeeder extends Seeder {

	public function run()
	{
		DB::table('entries')->delete();
		DB::unprepared("ALTER TABLE `entries` AUTO_INCREMENT = 1;");

		for($i=1; $i <= 25; ++$i) {
			Entry::create([
				'gallery_id' => rand(1, 9),
				'title' => 'Entry #' . $i,
				'filename' => 'entry_' . $i . '.png'
			]);
		}
	}
}