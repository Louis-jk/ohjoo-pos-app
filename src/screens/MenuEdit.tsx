import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import Draggable from 'react-draggable';

// Material UI Components
import Button from '@material-ui/core/Button';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material icons
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import QueueIcon from '@material-ui/icons/Queue';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';

// Local Component
import Api from '../Api';
import Header from '../components/Header';
import { baseStyles, theme, MainBox } from '../styles/base';
import { MenuStyles } from '../styles/custom';


interface IProps {
  props: object;
}

interface IDetails {
  [key: string]: string;
}

interface ISelectOption {
  value: string;
  price: string;
}

interface IOption {
  [key: string]: string
}

interface MenuOption {
  name: string;
  select: IOption[];
}

interface DeleteType {
  type: string;
  parent: number;
  child: number;
}
interface ICategory {
  label: string;
  value: string;
}
interface IMenu {
  ca_name: string;
  ca_code: string;
}

type OptionType = 'default' | 'add';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function MenuEdit(props: IProps) {

  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const base = baseStyles();
  const menu = MenuStyles();

  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [isLoading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState<IDetails>({});
  const [category, setCategory] = React.useState(''); // 카테고리 지정값
  const [options, setOptions] = React.useState<MenuOption[]>([]);
  const [addOptions, setAddOptions] = React.useState<MenuOption[]>([]);
  const [open, setOpen] = React.useState(false);

  const [optionType, setOptionType] = React.useState<OptionType>("default");
  const [parentIndex, setParentIndex] = React.useState(0);
  const [childIndex, setChildIndex] = React.useState(0);

  const createOption = () => {
    return ({
      multiple: false,
      name: '',
      select: [
        {
          value: '', price: '',
        }
      ],
    });
  };

  const optionAddHandler = (payload: OptionType) => {
    if (payload === 'default') {
      if (options.length < 10) {
        setOptions(options => {
          const result = [...options];
          result.push(createOption());
          return result;
        });
      } else {
        alert('최대 10개 입력하실 수 있습니다.');
      }
    } else {
      setAddOptions(options => {
        const result = [...options];
        result.push(createOption());
        return result;
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategory(event.target.value as string);
  };

  const handleClickOpen = (type: OptionType, parent: number, child: number) => {
    setOptionType(type);
    setParentIndex(parent);
    setChildIndex(child);
    setOpen(true);
  };

  // 옵션 삭제
  const deleteOption = () => {

    if (optionType === 'default') {
      setOptions(options => {
        const result = [...options];
        result[parentIndex].select.splice(childIndex, 1);
        return result;
      })
    } else {
      setAddOptions(options => {
        const result = [...options];
        result[parentIndex].select.splice(childIndex, 1);
        return result;
      })
    }
    setOpen(false);
  }

  // (등록된)카테고리 불러오기
  const [menuCategory, setMenuCategory] = React.useState<ICategory[]>([]);

  const getCategoryHandler = () => {
    setLoading(true);
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'select'
    }

    Api.send('store_item_category', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {

        arrItems.map((menu: IMenu) => {
          setMenuCategory(prev => [
            ...prev,
            {
              label: menu.ca_name,
              value: menu.ca_code
            }
          ]
          );
        });
        setLoading(false);
      } else {
        setLoading(false);
        console.log('메뉴를 가져오지 못했습니다.');
      }
    });
  }

  // 메뉴 상세 불러오기
  const getMenusDetailHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      it_id: id
    };
    Api.send('store_item_detail', param, (args: any) => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log("success?", arrItems)
        setDetails(arrItems);
        setCategory(arrItems.ca_code);
        setOptions(arrItems.menuOption);
        setAddOptions(arrItems.menuAddOption);
      } else {
        console.log("faild?", arrItems)
        setDetails({});
        setOptions([]);
        setAddOptions([]);
      }
    });
  }

  React.useEffect(() => {
    getCategoryHandler();
    getMenusDetailHandler();
  }, [])


  return (
    <Box component="div">
      <Header type="menuEdit" />
      {isLoading ?
        <div className={base.loadingWrap}>
          <CircularProgress disableShrink style={{ width: 50, height: 50, color: '#54447B' }} />
        </div>
        :
        <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className={base.mb10} style={{ position: 'relative' }}>
                {details.it_img1 ?
                  <Typography component="img" src={details.it_img1} className={menu.menuImg} alt={details.menuName} />
                  :
                  <Box className={menu.menuImg} style={{ display: 'block', backgroundColor: '#e5e5e5' }}></Box>
                }
                <input
                  accept="image/*"
                  className={menu.menuInput}
                  id="contained-button-file"
                  multiple
                  type="file"
                // onChange={handleUploadClick}
                />
                <label htmlFor="contained-button-file" style={{ position: 'absolute', right: 0, bottom: 10 }}>
                  <Fab component="span" variant="circular" color="primary" style={{ backgroundColor: '#54447B', color: '#FFEB99' }} className={menu.photoSelectIcon}>
                    <AddPhotoAlternateOutlinedIcon />
                  </Fab>
                </label>
              </div>
              <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue="0">
                  <FormControlLabel
                    value={'1'}
                    checked={details.it_type1 === '1' ? true : false}
                    control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                    label="대표메뉴"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: 'row' }}
                    onChange={e => setDetails({
                      ...details,
                      it_type1: '1'
                    })}
                  />
                  <FormControlLabel
                    value={'0'}
                    checked={details.it_type1 === '0' ? true : false}
                    control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                    label="기본메뉴"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: 'row' }}
                    onChange={e => setDetails({
                      ...details,
                      it_type1: '0'
                    })}
                  />
                </RadioGroup>
              </FormControl>
              {details.it_type1 === '1' ?
                <div className={base.mb20}>
                  <Typography variant="body1" component="p" color="primary">
                    ※ 대표메뉴로 지정된 상태입니다.
                  </Typography>
                </div>
                :
                <div className={base.mb20}>
                  <Typography variant="body1" component="p" color="textSecondary">
                    ※ 기본메뉴인 상태입니다.
                  </Typography>
                </div>
              }
              <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue="0">
                  <FormControlLabel
                    value={'1'}
                    checked={details.it_use === '1' ? true : false}
                    control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                    label="판매가능"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: 'row' }}
                    onChange={e => setDetails({
                      ...details,
                      it_use: '1'
                    })}
                  />
                  <FormControlLabel
                    value={'0'}
                    checked={details.it_use === '0' ? true : false}
                    control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                    label="판매중지"
                    labelPlacement="start"
                    style={{ width: 150, margin: 0, flexDirection: 'row' }}
                    onChange={e => setDetails({
                      ...details,
                      it_use: '0'
                    })}
                  />
                </RadioGroup>
              </FormControl>
              {details.it_use === '1' ?
                <div className={base.mb20}>
                  <Typography variant="body1" component="p" color="primary">
                    ※ 현재 판매중인 메뉴입니다.
                  </Typography>
                </div>
                :
                <div className={base.mb20}>
                  <Typography variant="body1" component="p" color="textSecondary">
                    ※ 현재 판매중지 상태인 메뉴입니다.
                  </Typography>
                </div>
              }
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" className={base.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">카테고리</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={category}
                  // onChange={handleChange}
                  label="카테고리"
                >
                  <MenuItem value="">
                    <em>선택해주세요</em>
                  </MenuItem>
                  {menuCategory && menuCategory.length > 0 ?
                    menuCategory.map((category, index) => (
                      <MenuItem key={index} value={category.value}>{category.label}</MenuItem>
                    ))
                    : null}

                </Select>
                <div className={base.mb30}></div>
                <TextField
                  value={details.menuName === null || details.menuName === undefined ? '' : details.menuName}
                  id="outlined-basic"
                  label="메뉴명"
                  variant="outlined"
                  onChange={e => setDetails({
                    ...details,
                    menuName: e.target.value as string
                  })}
                />
                <div className={base.mb30}></div>
                <TextField
                  value={details.menuInfo === null || details.menuInfo === undefined ? '' : details.menuInfo}
                  id="outlined-basic"
                  label="기본설명"
                  variant="outlined"
                  onChange={e => setDetails({
                    ...details,
                    menuInfo: e.target.value as string
                  })}
                />
                <div className={base.mb30}></div>
                <TextField
                  value={details.menuPrice === null || details.menuPrice === undefined ? '' : Api.comma(details.menuPrice)}
                  id="outlined-basic"
                  label="판매가격"
                  variant="outlined"
                  onChange={e => setDetails({
                    ...details,
                    menuPrice: e.target.value as string
                  })}
                />
                <div className={base.mb30}></div>
                <TextField
                  value={details.menuDescription === null || details.menuDescription === undefined ? '' : details.menuDescription}
                  fullWidth
                  className={base.multiTxtField}
                  id="outlined-multiline-static"
                  label="메뉴상세설명"
                  multiline
                  rows={10}
                  defaultValue="메뉴 상세설명을 작성해주세요."
                  variant="outlined"
                  onChange={e => setDetails({
                    ...details,
                    menuDescription: e.target.value as string
                  })}
                />
              </FormControl>
            </Grid>
          </Grid>
          <div className={base.mb30}></div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className={base.mb30}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="h6">
                    기본옵션
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => optionAddHandler('default')}
                    color="primary"
                    startIcon={<QueueIcon />}
                  >
                    옵션추가
                  </Button>
                </div>
              </div>
              {options && options.length > 0 && options.map((option, index) => (
                <FormControl key={index} fullWidth>
                  <Box className={base.fieldMargin} flexDirection="row" key={index} style={{ height: 50 }}>
                    <TextField
                      value={option.name === null || option.name === undefined ? '' : option.name}
                      id="outlined-basic"
                      label={`기본 ${index < 9 ? '0' : ''}${index + 1} - 옵션명`}
                      variant="outlined"
                      className={base.fieldMargin}
                      style={{ width: '40%', marginRight: '1%' }}
                      onChange={e => {
                        setOptions(options => {
                          const result = [...options];
                          result[index].name = e.target.value as string;
                          return result;
                        })
                      }}
                    />
                    <Button
                      style={{ width: '29%', height: 56, color: '#666', borderColor: '#C4C4C4', marginRight: '1%' }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<HighlightOffIcon />}
                      onClick={() =>
                        // setAddOptions(options => {
                        //   const result = [...options];
                        //   result[index].select.push({
                        //     value: '', price: '',
                        //   });
                        //   return result;
                        // })

                        setOptions(options => {
                          const result = [...options];
                          result.splice(index, 1);
                          return result;
                        })
                      }
                    >
                      삭제
                    </Button>
                    <Button
                      style={{ width: '29%', height: 56, color: '#666', borderColor: '#C4C4C4' }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<PostAddIcon />}
                      onClick={() =>
                        setOptions(options => {
                          const result = [...options];
                          result[index].select.push({
                            value: '', price: '',
                          });
                          return result;
                        })
                      }
                    >
                      추가
                    </Button>
                  </Box>
                  {option.select && option.select.map((item, selectIndex) => (
                    <Box className={base.fieldMargin} flexDirection="row" key={selectIndex} style={{ height: 50 }}>
                      <TextField
                        style={{ width: '40%', marginRight: '1%' }}
                        value={item.value === null || item.value === undefined ? '' : item.value}
                        id="outlined-basic"
                        label={`기본 ${index < 9 ? '0' : ''}${index + 1} - 세부명`}
                        variant="outlined"
                        onChange={e => {
                          setOptions(options => {
                            const result = [...options];
                            result[index].select[selectIndex].value = e.target.value as string;
                            return result;
                          })
                        }}
                      />
                      <TextField
                        style={{ width: '39%', marginRight: '1%' }}
                        value={item.price === null || item.price === undefined ? '' : item.price}
                        id="outlined-basic"
                        label={`기본 ${index < 9 ? '0' : ''}${index + 1} - 추가금액`}
                        variant="outlined"
                        onChange={e => {
                          setOptions(options => {
                            const result = [...options];
                            result[index].select[selectIndex].price = e.target.value as string;
                            return result;
                          })
                        }}
                      />
                      <Button
                        style={{ width: '19%', height: 55, color: '#666', borderColor: '#e5e5e5' }}
                        variant="outlined"
                        // startIcon={<HighlightOffIcon />}
                        onClick={() => handleClickOpen('default', index, selectIndex)}
                      >
                        삭제
                      </Button>
                    </Box>
                  )
                  )}
                  <div style={{ marginTop: 10, marginBottom: 23, height: 1, backgroundColor: '#e5e5e5' }}></div>
                </FormControl>
              )
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={base.mb30}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="h6">
                    추가옵션
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => optionAddHandler('add')}
                    color="primary"
                    startIcon={<QueueIcon />}
                  >
                    옵션추가
                  </Button>
                </div>
              </div>
              {addOptions && addOptions.length > 0 && addOptions.map((option, index) => (
                <FormControl key={index} fullWidth>
                  <Box className={base.fieldMargin} flexDirection="row" key={index} style={{ height: 50 }}>
                    <TextField
                      value={option.name === null || option.name === undefined ? '' : option.name}
                      id="outlined-basic"
                      label={`추가 ${index < 9 ? '0' : ''}${index + 1} - 옵션명`}
                      variant="outlined"
                      className={base.fieldMargin}
                      style={{ width: '40%', marginRight: '1%' }}
                      onChange={e => {
                        setAddOptions(options => {
                          const result = [...options];
                          result[index].name = e.target.value as string;
                          return result;
                        })
                      }}
                    />
                    <Button
                      style={{ width: '29%', height: 56, color: '#666', borderColor: '#C4C4C4', marginRight: '1%' }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<HighlightOffIcon />}
                      onClick={() =>
                        setAddOptions(options => {
                          const result = [...options];
                          result[index].select.push({
                            value: '', price: '',
                          });
                          return result;
                        })
                      }
                    >
                      삭제
                    </Button>
                    <Button
                      style={{ width: '29%', height: 56, color: '#666', borderColor: '#C4C4C4' }}
                      variant="outlined"
                      color="secondary"
                      startIcon={<PostAddIcon />}
                      onClick={() =>
                        setAddOptions(options => {
                          const result = [...options];
                          result[index].select.push({
                            value: '', price: '',
                          });
                          return result;
                        })
                      }
                    >
                      추가
                    </Button>
                  </Box>
                  {option.select && option.select.map((item, selectIndex) => (
                    <Box className={base.fieldMargin} flexDirection="row" key={selectIndex} style={{ height: 50 }}>
                      <TextField
                        style={{ width: '40%', marginRight: '1%' }}
                        value={item.value === null || item.value === undefined ? '' : item.value}
                        id="outlined-basic"
                        label={`추가 ${index < 9 ? '0' : ''}${index + 1} - 세부명`}
                        variant="outlined"
                        onChange={e => {
                          setAddOptions(options => {
                            const result = [...options];
                            result[index].select[selectIndex].value = e.target.value as string;
                            return result;
                          })
                        }}
                      />
                      <TextField
                        style={{ width: '39%', marginRight: '1%' }}
                        value={item.price === null || item.price === undefined ? '' : item.price}
                        id="outlined-basic"
                        label={`추가 ${index < 9 ? '0' : ''}${index + 1} - 추가금액`}
                        variant="outlined"
                        onChange={e => {
                          setAddOptions(options => {
                            const result = [...options];
                            result[index].select[selectIndex].price = e.target.value as string;
                            return result;
                          })
                        }}
                      />
                      <Button
                        style={{ width: '19%', height: 55, color: '#666', borderColor: '#e5e5e5' }}
                        variant="outlined"
                        color="secondary"
                        // startIcon={<HighlightOffIcon />}
                        onClick={() => handleClickOpen('add', index, selectIndex)}
                      >
                        삭제
                      </Button>
                    </Box>
                  )
                  )
                  }
                  <div style={{ marginTop: 10, marginBottom: 23, height: 1, backgroundColor: '#e5e5e5' }}></div>
                </FormControl>
              )
              )}
            </Grid>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: 'move', width: 500 }} id="draggable-dialog-title">
              정말 삭제하시겠습니까?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                선택하신 세부옵션을 삭제하시겠습니까?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                취소
              </Button>
              <Button onClick={deleteOption} color="primary">
                삭제하기
              </Button>
            </DialogActions>
          </Dialog>
        </MainBox>
      }
    </Box>
  );
}