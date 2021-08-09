import React from 'react';
import Draggable from 'react-draggable';
import { useSelector } from 'react-redux';

// Material UI Components
import Paper, { PaperProps } from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

interface IOption {
  [key: string]: string
}
interface MenuOption {
  name: string;
  select: IOption[];
}
interface ICategory {
  label: string;
  value: string;
}
interface IMenu {
  ca_name: string;
  ca_code: string;
}

type OptionType = 'default' | 'add'; // 기본옵션 | 추가 옵션
type OptionSize = 'option' | 'detail'; // 옵션 | 세부
type CheckedType = '1' | '0'; // 가능(true) | 불가능(false)

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function MenuAdd(props: any) {

  const base = baseStyles();
  const menu = MenuStyles();
  const { mt_id, mt_jumju_code } = useSelector((state: any) => state.login);
  const [isLoading, setLoading] = React.useState(false);

  const [category, setCategory] = React.useState(''); // 카테고리 선택값
  const [options, setOptions] = React.useState<MenuOption[]>([]); // 기본옵션
  const [addOptions, setAddOptions] = React.useState<MenuOption[]>([]); // 추가옵션
  const [open, setOpen] = React.useState(false);
  const [optionType, setOptionType] = React.useState<OptionType>("default"); // 옵션 타입('default' : 기본옵션 | 'add' : 추가옵션)
  const [optionSize, setOptionSize] = React.useState<OptionSize>('option'); // 옵션 index
  const [parentIndex, setParentIndex] = React.useState(0); // 옵션 index
  const [childIndex, setChildIndex] = React.useState(0); // 세부옵션 index
  const [checked01, setChecked01] = React.useState<CheckedType>('0'); // 대표메뉴('1' : 지정 | '0': 지정안함)
  const [checked02, setChecked02] = React.useState<CheckedType>('1'); // 판매가능('1' : 가능 | '0': 불가)
  const [image, setImage] = React.useState(''); // 메뉴 이미지 URL

  // 이미지 업로드
  const [files, setFiles] = React.useState({});
  const onChange = (evt: any) => {
    console.log("img evt?", evt);

    if (evt.target.files.length) {
      let file = (evt.target.files)[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        setImage(e.target.result);
        console.log("e.target >>> ", e.target);
        console.log("e.target.result >>> ", e.target.result);
      }
    } else {
      setImage("https://dummyimage.com/500x500/ffffff/000000.png&text=preview+image");
    }
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

  React.useEffect(() => {
    getCategoryHandler();
  }, [mt_id, mt_jumju_code])

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

  // 옵션 삭제 전 핸들러
  const optionDeleteConfirmHandler = (size: OptionSize, type: OptionType, parent: number, child: number) => {
    setOptionSize(size);
    setOptionType(type);
    setParentIndex(parent);
    setChildIndex(child);
    setOpen(true);
  };

  // 세부 옵션 삭제 전 핸들러
  const handleClickOpen = (type: OptionType, parent: number, child: number) => {
    setOptionType(type);
    setParentIndex(parent);
    setChildIndex(child);
    setOpen(true);
  };

  // 세부 옵션 삭제 핸들러
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

  return (
    <Box component="div" className={base.root}>
      <Header type="menuAdd" />
      <MainBox component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box className={base.mb10} style={{ position: 'relative' }}>
              {image ?
                <img id="menuImg" src={image} className={menu.menuImg} alt="메뉴이미지" />
                :
                <Box style={{ position: 'relative', width: '100%', height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ececec' }}>
                  <p style={{ color: '#666' }}>이미지 업로드</p>
                </Box>
              }
              <input
                accept="image/*"
                className={menu.menuInput}
                id="contained-button-file"
                multiple
                type="file"
                onChange={onChange}
              // onChange={handleUploadClick}
              />
              <label htmlFor="contained-button-file" style={{ position: 'absolute', right: 0, bottom: 10 }}>
                <Fab component="span" variant="circular" color="primary" style={{ color: theme.palette.primary.contrastText }} className={menu.photoSelectIcon}>
                  <AddPhotoAlternateOutlinedIcon />
                </Fab>
              </label>
            </Box>
            <div className={base.mb20}></div>
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="0">
                <FormControlLabel
                  value={'1'}
                  checked={checked01 === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="대표메뉴"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={() => setChecked01('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked01 === '0' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="기본메뉴"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={() => setChecked01('0')}
                />
              </RadioGroup>
            </FormControl>
            {checked01 === '1' ?
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="primary">
                  ※ 대표메뉴로 지정하였습니다.
                </Typography>
              </div>
              :
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="textSecondary">
                  ※ 기본메뉴로 지정되었습니다.
                </Typography>
              </div>
            }
            <FormControl component="fieldset">
              <RadioGroup row aria-label="position" name="position" defaultValue="0">
                <FormControlLabel
                  value={'1'}
                  checked={checked02 === '1' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="판매가능"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={() => setChecked02('1')}
                />
                <FormControlLabel
                  value={'0'}
                  checked={checked02 === '0' ? true : false}
                  control={<Radio color="primary" style={{ paddingLeft: 0 }} />}
                  label="판매중지"
                  labelPlacement="start"
                  style={{ width: 150, margin: 0, flexDirection: 'row' }}
                  onChange={() => setChecked02('0')}
                />
              </RadioGroup>
            </FormControl>
            {checked02 === '1' ?
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="primary">
                  ※ 판매 가능 상태로 지정하였습니다.
                </Typography>
              </div>
              :
              <div className={base.mb20}>
                <Typography variant="body1" component="p" color="textSecondary">
                  ※ 판매 불가 상태로 지정하였습니다.
                </Typography>
              </div>
            }
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" className={base.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">카테고리</InputLabel>
              <Select
                value={category}
                onChange={e => setCategory(e.target.value as string)}
                label="카테고리"
                required
              >
                {menuCategory && menuCategory.length > 0 ?
                  menuCategory.map((category, index) => (
                    <MenuItem key={index} value={category.value}>{category.label}</MenuItem>
                  ))
                  : <MenuItem value="">
                    <em>등록된 카테고리가 없습니다.</em>
                  </MenuItem>}
              </Select>
              <div className={base.mb30}></div>
              <TextField
                // value={details.menuName === null || details.menuName === undefined ? '' : details.menuName}
                id="outlined-basic"
                label="메뉴명"
                variant="outlined"
                required
              // onChange={e => setDetails({
              // ...details,
              // menuName: e.target.value as string
              // })}
              />
              <div className={base.mb30}></div>
              <TextField
                // value={details.menuInfo === null || details.menuInfo === undefined ? '' : details.menuInfo}
                id="outlined-basic"
                label="기본설명"
                variant="outlined"
                required
              // onChange={e => setDetails({
              // ...details,
              // menuInfo: e.target.value as string
              // })}
              />
              <div className={base.mb30}></div>
              <TextField
                // value={details.menuPrice === null || details.menuPrice === undefined ? '' : Api.comma(details.menuPrice)}
                id="outlined-basic"
                label="판매가격"
                variant="outlined"
                required
              // onChange={e => setDetails({
              // ...details,
              // menuPrice: e.target.value as string
              // })}
              />
              <div className={base.mb30}></div>
              <TextField
                // value={details.menuDescription === null || details.menuDescription === undefined ? '' : details.menuDescription}
                fullWidth
                className={base.multiTxtField}
                id="outlined-multiline-static"
                label="메뉴상세설명"
                required
                multiline
                rows={10}
                placeholder="메뉴 상세설명을 작성해주세요."
                variant="outlined"
              // onChange={e => setDetails({
              //     ...details,
              //     menuDescription: e.target.value as string
              // })}
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
                    label={`기본옵션 ${index < 9 ? '0' : ''}${index + 1} - 옵션명`}
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
                      setAddOptions(options => {
                        const result = [...options];
                        result[index].select.push({
                          value: '', price: '',
                        });
                        return result;
                      })
                    }
                  >
                    옵션삭제
                  </Button>
                  <Button
                    style={{ width: '29%', height: 56, color: '#666', borderColor: '#e5e5e5' }}
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
                    세부추가
                  </Button>
                </Box>
                {option.select && option.select.map((item, selectIndex) => (
                  <Box className={base.fieldMargin} flexDirection="row" key={selectIndex} style={{ height: 50 }}>
                    <TextField
                      style={{ width: '40%', marginRight: '1%' }}
                      value={item.value === null || item.value === undefined ? '' : item.value}
                      id="outlined-basic"
                      label={`기본옵션 ${index < 9 ? '0' : ''}${index + 1} - 세부명`}
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
                      label={`기본옵션 ${index < 9 ? '0' : ''}${index + 1} - 추가금액`}
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
                      startIcon={<HighlightOffIcon />}
                      onClick={() => handleClickOpen('default', index, selectIndex)}
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
                    label={`추가옵션 ${index < 9 ? '0' : ''}${index + 1} - 옵션명`}
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
                    옵션삭제
                  </Button>
                  <Button
                    style={{ width: '29%', height: 56, color: '#666', borderColor: '#e5e5e5' }}
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
                    세부추가
                  </Button>
                </Box>
                {option.select && option.select.map((item, selectIndex) => (
                  <Box className={base.fieldMargin} flexDirection="row" key={selectIndex} style={{ height: 50 }}>
                    <TextField
                      style={{ width: '40%', marginRight: '1%' }}
                      value={item.value === null || item.value === undefined ? '' : item.value}
                      id="outlined-basic"
                      label={`추가옵션 ${index < 9 ? '0' : ''}${index + 1} - 세부명`}
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
                      label={`추가옵션 ${index < 9 ? '0' : ''}${index + 1} - 추가금액`}
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
                      startIcon={<HighlightOffIcon />}
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
      </MainBox >
    </Box >
  );
}