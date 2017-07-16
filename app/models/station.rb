class Station < ApplicationRecord
  has_many :station_lists, inverse_of: :station
  has_many :users, through: :station_lists
end
