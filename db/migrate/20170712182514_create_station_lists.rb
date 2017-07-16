class CreateStationLists < ActiveRecord::Migration[5.1]
  def change
    create_table :station_lists do |t|
      t.belongs_to :station
      t.belongs_to :user, foreign_key: true

      t.timestamps
    end
  end
end
