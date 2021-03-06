/* eslint-disable import/no-cycle */
import BasicModel from './BasicModel';
import DACService from '../services/DACService';
import UploadService from '../services/UploadsService';
/**
 * The DApp DAC model
 */
class DAC extends BasicModel {
  static get CANCELED() {
    return 'Canceled';
  }

  static get PENDING() {
    return 'Pending';
  }

  static get ACTIVE() {
    return 'Active';
  }

  static get type() {
    return 'dac';
  }

  constructor(data) {
    super(data);

    this.communityUrl = data.communityUrl || '';
    this.delegateId = data.delegateId || 0;
    this.status = data.status || DAC.PENDING;
    this.ownerAddress = data.ownerAddress;
    this._id = data._id;
    this.confirmations = data.confirmations || 0;
    this.requiredConfirmations = data.requiredConfirmations;
  }

  toFeathers(txHash) {
    const dac = {
      title: this.title,
      description: this.description,
      communityUrl: this.communityUrl,
      delegateId: this.delegateId,
      image: this.image,
      totalDonated: this.totalDonated,
      donationCount: this.donationCount,
    };
    if (!this.id) dac.txHash = txHash;
    return dac;
  }

  save(onCreated, afterEmit) {
    if (this.newImage) {
      UploadService.save(this.image).then(file => {
        // Save the new image address and mark it as old
        this.image = file.url;
        this.newImage = false;

        DACService.save(this, this.owner.address, onCreated, afterEmit);
      });
    } else {
      DACService.save(this, this.owner.address, onCreated, afterEmit);
    }
  }

  get communityUrl() {
    return this.myCommunityUrl;
  }

  set communityUrl(value) {
    this.checkType(value, ['string'], 'communityUrl');
    this.myCommunityUrl = value;
  }

  get delegateId() {
    return this.myDelegateId;
  }

  set delegateId(value) {
    this.checkType(value, ['number', 'string'], 'delegateId');
    this.myDelegateId = value;
  }

  get status() {
    return this.myStatus;
  }

  set status(value) {
    this.checkValue(value, [DAC.PENDING, DAC.ACTIVE, DAC.CANCELED], 'status');
    this.myStatus = value;
    if (value === DAC.PENDING) this.myOrder = 1;
    else if (value === DAC.ACTIVE) this.myOrder = 2;
    else if (value === DAC.CANCELED) this.myOrder = 3;
    else this.myOrder = 4;
  }
}

export default DAC;
