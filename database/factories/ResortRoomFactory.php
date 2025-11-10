<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resort>
 */
class ResortRoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resort_name'   => $this->faker->words(2, true) . ' Room',
            'description'   => $this->faker->sentence(10),
            'capacity'      => $this->faker->numberBetween(2, 8),
            'price_per_day' => $this->faker->randomFloat(2, 2000, 6000),
            'image_url'     => $this->faker->imageUrl(640, 480, 'hotel', true),
            'contact'     => $this->faker->phoneNumber(),
            'resort_email'     => $this->faker->email(),
            'status'        => 'available',
            'pax'           => $this->faker->numberBetween(2, 8),
            'amenities'     => implode(', ', $this->faker->randomElements(
                ['Aircon', 'WiFi', 'TV', 'Mini Fridge', 'Hot Shower', 'Kitchenette'],
                $this->faker->numberBetween(2, 4)
            ))

        ];
    }
}
