<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		$this->call('GalleryTableSeeder');
		$this->call('EntryTableSeeder');
		$this->call('PhotoTableSeeder');
	}

}
