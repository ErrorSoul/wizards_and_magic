class MagicList < ApplicationRecord
  belongs_to :magic, inverse_of: :magic_lists
  belongs_to :user,  inverse_of: :magic_lists
end
