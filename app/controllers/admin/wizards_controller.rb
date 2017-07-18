class Admin::WizardsController < Admin::BaseController
  def profile
    current_user.build_station_list unless current_user.station.present?
  end

  def create
  end

  def show
  end

  def fetch_station
    sleep 0.5
    render json: { user: current_user, station: (current_user.station || { name: ''}) }
  end

  def update
    # if current_user.update(wizard_params)
    #   redirect_to(admin_wizard_path(current_user), notice: 'Country was successfully destroyed.') && return
    # else
    #   render :profile
    # end
  end

  def search
    result = Magic.where("name ~* ?", "#{params[:search]}")
    puts "Result is #{result.inspect}"
    render json: { result: result }
  end

  private

  def wizard_params
    params.require(:user).permit(:first_name, :last_name, :category_id, :about_me,
                                 station_list_attributes: [:station_id],
                                 service_list_attributes: [:id, :service_id, :_destroy, :price]
                                )
  end
end
