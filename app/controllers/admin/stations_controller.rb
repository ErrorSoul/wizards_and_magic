class Admin::StationsController < Admin::BaseController
  before_action :set_station, only: [:show, :edit, :update, :destroy]

  # GET /stations
  # GET /stations.json
  def index
    @stations = Station.order(id: :desc)
                         .page(params[:page])
    @obj = TableObject.new(
      name: "Station",
      pool: @stations,
      attrs: get_attrs
    )
  end

  def new
    @station = Station.new
  end

  # GET /stations/1
  # GET /stations/1.json
  def show
    @obj = ShowObject.new(elem: @station)
  end

  # GET /stations/new
  def new
    @station = Station.new
  end

  # GET /stations/1/edit
  def edit
  end

  # POST /stations
  # POST /stations.json
  def create
    @station = Station.new(station_params)
    if @station.save
      flash[:success] =  'Station was successfully created.'
      return redirect_to admin_station_path(@station)
    else
      render :new
    end
  end

  # PATCH/PUT /stations/1
  # PATCH/PUT /stations/1.json
  def update
    respond_to do |format|
      if @station.update(station_params)
        format.html { redirect_to admin_station_path(@station), notice: 'Station was successfully updated.' }
        format.json { render :show, status: :ok, location: @station }
      else
        format.html { render :edit }
        format.json { render json: @station.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stations/1
  # DELETE /stations/1.json
  def destroy
    @station.destroy
    respond_to do |format|
      format.html { redirect_to admin_categories_url, notice: 'Station was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def search
    stations = Station.find_by(id: params[:product_search][:name])
    render json: { products: [stations] }
  end

  private

  def get_attrs
    %w[name]
  end
    # Use callbacks to share common setup or constraints between actions.
    def set_station
      @station = Station.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def station_params
      params.require(:station).permit(:name)
    end
end
